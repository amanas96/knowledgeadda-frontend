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
  const [backendError, setBackendError] = useState("");

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

      setToken(data.accessToken);
      setUser(data.user);
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${data.accessToken}`;

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
      setBackendError("");

      const { data } = await apiClient.post("/api/auth/register", {
        name,
        email,
        password,
      });

      setToken(data.accessToken);
      setUser(data.user);
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${data.accessToken}`;

      return true;
    } catch (error) {
      if (error.response) {
        const msg =
          error.response.data.message ||
          error.response.data.errors?.[0]?.msg ||
          "Something went wrong";

        setBackendError(msg);
      } else {
        setBackendError("Network error");
      }
      return false;
    }
  };

  // ============================================
  // LOGOUT FUNCTION
  // ============================================

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      setToken(null);
      delete apiClient.defaults.headers.common["Authorization"];
    }
  }, []);

  /////////////// forgot password
  const forgotPassword = async (email) => {
    try {
      const response = await apiClient.post("/api/auth/forgot-password", {
        email,
      });
      if (response.data?.success || response.data?.message) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
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
      return false;
    }
  };

  const updateSubscriptionStatus = (isSubscribed) => {
    setUser((prevUser) => ({
      ...prevUser,
      isSubscribed: isSubscribed,
    }));
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  // ============================================
  // AXIOS INTERCEPTORS (The Refresh Logic)
  // ============================================
  useEffect(() => {
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const url = originalRequest.url;

        if (
          url.includes("/api/auth/refresh") ||
          url.includes("/api/auth/login")
        ) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!isRefreshingRef.current) {
            isRefreshingRef.current = true;
            try {
              const { data } = await apiClient.post("/api/auth/refresh");

              setToken(data.accessToken);
              setUser(data.user);
              apiClient.defaults.headers.common["Authorization"] =
                `Bearer ${data.accessToken}`;
              originalRequest.headers["Authorization"] =
                `Bearer ${data.accessToken}`;

              isRefreshingRef.current = false;

              return apiClient(originalRequest);
            } catch (refreshError) {
              isRefreshingRef.current = false;
              logout();

              return Promise.reject(refreshError);
            }
          }
        }

        return Promise.reject(error);
      },
    );

    return () => apiClient.interceptors.response.eject(responseInterceptor);
  }, [logout]);

  // ============================================
  // VERIFY USER ON APP LOAD (using refreshToken)
  // ============================================
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await apiClient.post("/api/auth/refresh");
        setToken(data.accessToken);
        setUser(data.user);
        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${data.accessToken}`;
      } catch (error) {
        (setUser(null), setToken(null));
      } finally {
        setIsLoading(false);
      }
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
    isAuthenticated: !!user && !!token,
    login,
    register,
    backendError,
    setBackendError,
    logout,
    forgotPassword,
    resetPassword,
    updateUser,
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
