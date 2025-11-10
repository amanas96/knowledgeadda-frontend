import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import apiClient from "../api/axios";
import {
  forgotPassword,
  resetPassword,
} from "../../../server/src/controllers/authController";

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // This is the short-lived accessToken
  const [isLoading, setIsLoading] = useState(true); // For app load verification

  // Ref to prevent multiple concurrent refresh calls
  const isRefreshingRef = useRef(false);

  // ============================================
  // LOGIN FUNCTION
  // ============================================
  const login = async (email, password) => {
    try {
      // 1. Call the login API
      const { data } = await apiClient.post("/api/auth/login", {
        email,
        password,
      });

      // 2. Set state from the response
      setToken(data.accessToken);
      setUser(data.user);

      // 3. Store the long-lived refreshToken in localStorage
      localStorage.setItem("refreshToken", data.refreshToken);

      // 4. Set the default auth header for all future axios requests
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${data.accessToken}`;

      return true; // Indicate success
    } catch (error) {
      console.error("Login failed:", error);
      return false; // Indicate failure
    }
  };

  // ============================================
  // REGISTER FUNCTION
  // ============================================
  const register = async (name, email, password) => {
    try {
      // 1. Call the register API
      const { data } = await apiClient.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // 2. Set state
      setToken(data.accessToken);
      setUser(data.user);

      // 3. Store refresh token
      localStorage.setItem("refreshToken", data.refreshToken);

      // 4. Set default auth header
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${data.accessToken}`;

      return true; // Indicate success
    } catch (error) {
      console.error("Registration failed:", error);
      return false; // Indicate failure
    }
  };

  // ============================================
  // LOGOUT FUNCTION
  // ============================================
  // We wrap logout in useCallback to make it a stable dependency for useEffect
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        // Tell the backend to invalidate this refresh token
        await apiClient.post("/api/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout API call failed, logging out locally", error);
    } finally {
      // Clear everything from state and storage regardless of API call success
      setUser(null);
      setToken(null);
      localStorage.removeItem("refreshToken");
      delete apiClient.defaults.headers.common["Authorization"];
    }
  }, []); // Empty dependency array means this function is created once

  ///////////////////////////////////////
  // const forgotPassword = async (email) => {
  //   try {
  //     const res = await apiClient.post("/api/auth/forgot-password", { email });
  //     if (res.data.success) {
  //       console.log("Forgot Password:", res.data.message);
  //       return true;
  //     }

  //     return false;
  //   } catch (error) {
  //     console.log("Forgot Password failed", error);
  //     return false;
  //   }
  // };

  const forgotPassword = async (email) => {
    try {
      const response = await apiClient.post("/api/auth/forgot-password", {
        email,
      });

      // ✅ Safely check for success flag or message
      if (response.data?.success || response.data?.message) {
        console.log("Forgot Password success:", response.data);
        return true;
      } else {
        console.warn("Forgot Password unexpected response:", response);
        return false;
      }
    } catch (error) {
      console.error(
        "Forgot Password failed:",
        error.response?.data || error.message
      );
      return false;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const res = await apiClient.post(`/api/auth/reset-password/${token}`, {
        password,
      });
      return res.status === 200;
    } catch (error) {
      console.error("Reset password failed", error);
      return false;
    }
  };

  // ============================================
  // AXIOS INTERCEPTORS (The Refresh Logic)
  // ============================================
  useEffect(() => {
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response, // Pass through successful responses
      async (error) => {
        const originalRequest = error.config;

        // Check for 401 error and if we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Mark that we've tried to refresh once

          // Prevent multiple refresh calls at the same time
          if (!isRefreshingRef.current) {
            isRefreshingRef.current = true;
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
              try {
                // 1. Call the refresh endpoint
                const { data } = await apiClient.post("/api/auth/refresh", {
                  refreshToken,
                });

                // 2. Update state and headers with new accessToken
                setToken(data.accessToken);
                setUser(data.user);
                apiClient.defaults.headers.common["Authorization"] =
                  `Bearer ${data.accessToken}`;

                // 3. Update the original request's header
                originalRequest.headers["Authorization"] =
                  `Bearer ${data.accessToken}`;

                isRefreshingRef.current = false;

                // 4. Retry the original request with the new token
                return apiClient(originalRequest);
              } catch (refreshError) {
                console.error(
                  "Token refresh failed, logging out",
                  refreshError
                );
                isRefreshingRef.current = false;
                logout(); // Refresh failed, force logout
              }
            } else {
              // No refresh token found in storage, force logout
              isRefreshingRef.current = false;
              logout();
            }
          }
        }
        return Promise.reject(error); // Return other errors
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]); // Rerun if the logout function reference changes

  // ============================================
  // VERIFY USER ON APP LOAD (using refreshToken)
  // ============================================
  useEffect(() => {
    const verifyUser = async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        // Prevent race condition with interceptor
        if (!isRefreshingRef.current) {
          isRefreshingRef.current = true;
          try {
            // Call /refresh to get a new accessToken and user data
            const { data } = await apiClient.post("/api/auth/refresh", {
              refreshToken,
            });
            setToken(data.accessToken);
            setUser(data.user);
            apiClient.defaults.headers.common["Authorization"] =
              `Bearer ${data.accessToken}`;
          } catch (error) {
            console.error("Initial refresh failed, logging out", error);
            logout(); // Invalid/expired refresh token
          } finally {
            isRefreshingRef.current = false;
          }
        }
      }
      setIsLoading(false); // Done loading
    };

    verifyUser();
    // This effect should only run once on app mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const authValue = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook to consume the context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContext.Provider");
  }
  return context;
};
