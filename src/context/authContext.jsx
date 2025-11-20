import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import apiClient from "../api/axios";

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // This is the short-lived accessToken
  const [isLoading, setIsLoading] = useState(true);

  // Ref to prevent multiple concurrent refresh calls
  const isRefreshingRef = useRef(false);

  // // 🔍 DEBUG: Log state changes
  // useEffect(() => {
  //   console.log("🔐 AUTH STATE CHANGED:", {
  //     isLoading,
  //     isAuthenticated: !!token,
  //     user: user?.email || "null",
  //     token: token ? "exists" : "null",
  //   });
  // }, [isLoading, token, user]);

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
      localStorage.setItem("refreshToken", data.refreshToken);

      // 4. Set the default auth header for all future axios requests
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${data.accessToken}`;
      console.log("✅ Login successful:", data.user.email);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // ============================================
  // REGISTER FUNCTION
  // ============================================
  const register = async (name, email, password) => {
    try {
      const { data } = await apiClient.post("/api/auth/register", {
        name,
        email,
        password,
      });

      setToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem("refreshToken", data.refreshToken);
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${data.accessToken}`;
      console.log("✅ Registration successful:", data.user.email);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
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
        await apiClient.post("/api/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout API call failed, logging out locally", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("refreshToken");
      delete apiClient.defaults.headers.common["Authorization"];
      console.log("✅ Logged out successfully");
    }
  }, []);

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
        console.log("✅ Forgot Password success:", response.data);
        return true;
      } else {
        console.warn("Forgot Password unexpected response:", response);
        return false;
      }
    } catch (error) {
      console.error(
        "❌ Forgot Password failed:",
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
      console.error("❌ Reset password failed", error);
      return false;
    }
  };

  const updateSubscriptionStatus = (isSubscribed) => {
    console.log("💳 Updating subscription status:", isSubscribed);
    setUser((prevUser) => ({
      ...prevUser,
      isSubscribed: isSubscribed,
    }));
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
          console.log("⚠️ 401 Unauthorized - Attempting token refresh");
          originalRequest._retry = true; // Mark that we've tried to refresh once

          // Prevent multiple refresh calls at the same time
          if (!isRefreshingRef.current) {
            isRefreshingRef.current = true;
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
              try {
                console.log("🔄 Refreshing token...");
                const { data } = await apiClient.post("/api/auth/refresh", {
                  refreshToken,
                });

                setToken(data.accessToken);
                setUser(data.user);
                apiClient.defaults.headers.common["Authorization"] =
                  `Bearer ${data.accessToken}`;

                originalRequest.headers["Authorization"] =
                  `Bearer ${data.accessToken}`;

                isRefreshingRef.current = false;
                console.log("✅ Token refreshed successfully");
                // 4. Retry the original request with the new token
                return apiClient(originalRequest);
              } catch (refreshError) {
                console.error(
                  "❌ Token refresh failed, logging out",
                  refreshError
                );
                isRefreshingRef.current = false;
                logout(); // Refresh failed, force logout
              }
            } else {
              console.log("❌ No refresh token found, logging out");
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
      console.log("🔍 Verifying user on app load...");

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        // Prevent race condition with interceptor
        if (!isRefreshingRef.current) {
          isRefreshingRef.current = true;
          try {
            console.log("🔄 Calling refresh endpoint...");
            // Call /refresh to get a new accessToken and user data
            const { data } = await apiClient.post("/api/auth/refresh", {
              refreshToken,
            });
            console.log("✅ Initial refresh successful:", data.user.email);
            setToken(data.accessToken);
            setUser(data.user);
            apiClient.defaults.headers.common["Authorization"] =
              `Bearer ${data.accessToken}`;
          } catch (error) {
            console.error("❌ Initial refresh failed:", error);
            logout(); // Invalid/expired refresh token
          } finally {
            isRefreshingRef.current = false;
            setIsLoading(false);
          }
        }
      }
      // added only gor console
      else {
        console.log("⚠️ No refresh token found in localStorage");
        setIsLoading(false);
      } ////////////////////
      console.log("✅ Auth loading complete - setting isLoading to false");
    };
    verifyUser();
  }, []);

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
    updateSubscriptionStatus,
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
