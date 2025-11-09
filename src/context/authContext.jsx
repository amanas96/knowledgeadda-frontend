import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import apiClient, { setupInterceptors } from "../api/axios"; // Use our central API client

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true); // Start as true

  // --- LOGOUT FUNCTION ---
  // We define logout here so it can be used by interceptors
  // useCallback prevents it from being recreated on every render
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    delete apiClient.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  }, []);

  // --- SETUP INTERCEPTORS ---
  // This effect runs only once to set up the global error handler
  useEffect(() => {
    setupInterceptors(logout);
  }, [logout]); // Dependency on logout

  // --- VERIFY TOKEN ON APP LOAD ---
  // This effect runs once to verify a stored token
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          // Set token for the API client
          apiClient.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;
          // Fetch the user's profile
          const { data } = await apiClient.get("/api/auth/profile");

          setUser(data); // Set the user
          setToken(storedToken); // Confirm the token
        } catch (error) {
          // Token is invalid or expired
          console.error("Token verification failed", error);
          logout(); // Clear bad token
        }
      }
      setIsLoading(false); // We're done loading
    };

    verifyToken();
  }, [logout]); // Dependency on logout

  // --- LOGIN FUNCTION ---
  // This function now handles the entire login flow
  const login = async (email, password) => {
    try {
      // 1. Call login API to get token
      const { data } = await apiClient.post("/api/auth/login", {
        email,
        password,
      });
      const { token } = data;

      // 2. Set token in state, local storage, and headers
      localStorage.setItem("token", token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);

      // 3. Get user profile
      const { data: userData } = await apiClient.get("/api/auth/profile");
      setUser(userData);
      return true; // Success
    } catch (error) {
      console.error("Login failed", error);
      logout(); // Clear any bad state
      return false; // Failure
    }
  };

  // --- REGISTER FUNCTION ---
  const register = async (name, email, password) => {
    try {
      // 1. Call register API to get token
      const { data } = await apiClient.post("/api/auth/register", {
        name,
        email,
        password,
      });
      const { token } = data;

      // 2. Set token
      localStorage.setItem("token", token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);

      // 3. Get profile
      const { data: userData } = await apiClient.get("/api/auth/profile");
      setUser(userData);
      return true; // Success
    } catch (error) {
      console.error("Registration failed", error);
      logout();
      return false; // Failure
    }
  };

  // 4. Value to be passed to consumers
  const authValue = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token, // True if token is not null
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {!isLoading && children} {/* Don't render app until loading is done */}
    </AuthContext.Provider>
  );
};

// 5. Create a custom hook (this is the easy way to use the context)
export const useAuth = () => {
  return useContext(AuthContext);
};

{
  /*  import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import apiClient from '../api/axios';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use ref to track if we're currently refreshing to prevent multiple refresh calls
  const refreshPromiseRef = useRef(null);

  // ============================================
  // REFRESH TOKEN LOGIC
  // ============================================
  const refreshAccessToken = async () => {
    // If already refreshing, return the existing promise
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    setIsRefreshing(true);
    
    refreshPromiseRef.current = (async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await apiClient.post('/api/auth/refresh', {
          refreshToken
        });

        // Update tokens
        localStorage.setItem('token', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        
        setToken(data.accessToken);
        if (data.user) {
          setUser(data.user);
        }

        return data.accessToken;
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Clear everything and logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setToken(null);
        setUser(null);
        throw error;
      } finally {
        setIsRefreshing(false);
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  };

  // ============================================
  // API CLIENT INTERCEPTORS (NO MUTATIONS)
  // ============================================
  useEffect(() => {
    // REQUEST INTERCEPTOR: Add token to requests
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        // Don't add token to refresh endpoint
        if (config.url?.includes('/auth/refresh')) {
          return config;
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // RESPONSE INTERCEPTOR: Handle 401 errors with token refresh
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAccessToken();
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Refresh failed, user needs to login again
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [token]); // Re-run when token changes

  // ============================================
  // VERIFY TOKEN ON MOUNT
  // ============================================
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Verify token by fetching user profile
        const { data } = await apiClient.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        
        setUser(data);
        setToken(storedToken);
      } catch (error) {
        console.error('Token verification failed:', error);
        
        // Try to refresh the token
        try {
          await refreshAccessToken();
        } catch (refreshError) {
          // Both verification and refresh failed - clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setToken(null);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []); // Run only once on mount

  // ============================================
  // LOGIN FUNCTION
  // ============================================
  const login = async (accessToken, refreshToken, userData) => {
    try {
      localStorage.setItem('token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      setToken(accessToken);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // ============================================
  // LOGOUT FUNCTION
  // ============================================
  const logout = async () => {
    try {
      // Optional: Call logout endpoint to invalidate refresh token on server
      await apiClient.post('/api/auth/logout', {
        refreshToken: localStorage.getItem('refreshToken')
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setUser(null);
    }
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const authValue = {
    user,
    token,
    isLoading,
    isRefreshing,
    login,
    logout,
    refreshAccessToken,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};        */
}
