import axios from "axios";
import he from "he";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000,
});

// ── Recursive Decoder Function ──────────────────────────────────────────────
const decodeData = (data) => {
  if (data === null || data === undefined) return data;
  if (typeof data === "string") return he.decode(data);
  if (Array.isArray(data)) return data.map((item) => decodeData(item));
  if (typeof data === "object") {
    if (data instanceof Date) return data;
    const acc = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        acc[key] = decodeData(data[key]);
      }
    }
    return acc;
  }
  return data;
};

// ── Token Refresh State ─────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

// Resolve or reject all queued requests after a refresh attempt
const processQueue = (error) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
  failedQueue = [];
};

export const setupInterceptors = (logout) => {
  // ── Request Interceptor ───────────────────────────────────────────────────
  apiClient.interceptors.request.use(
    (config) => config,
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    },
  );

  // ── Response Interceptor ──────────────────────────────────────────────────
  apiClient.interceptors.response.use(
    (response) => {
      if (response.data) response.data = decodeData(response.data);
      return response;
    },
    async (error) => {
      if (error.response?.data) {
        error.response.data = decodeData(error.response.data);
      }

      // ── No response at all (network/timeout) ─────────────────────────────
      if (!error.response) {
        if (error.code === "ECONNABORTED") {
          console.error("Request timed out");
          return Promise.reject(
            new Error("Request timed out. Please try again."),
          );
        }
        console.error("Network error — server may be down");
        return Promise.reject(
          new Error("Network error. Please check your connection."),
        );
      }

      const { status } = error.response;
      const originalRequest = error.config;

      // ── 401: Try to refresh, then retry original request ─────────────────
      if (status === 401 && !originalRequest._retry) {
        // If a refresh is already in progress, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => apiClient(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        // Mark this request so it won't loop on a second 401
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Your refresh endpoint — adjust the URL to match your API
          await apiClient.post("/auth/refresh-token");

          processQueue(null); // unblock all queued requests
          return apiClient(originalRequest); // retry the original request
        } catch (refreshError) {
          processQueue(refreshError); // reject all queued requests
          logout(); // refresh failed → force logout
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (status === 403) console.warn("Access denied:", error.config.url);
      if (status >= 500)
        console.error("Server error:", status, error.config.url);

      return Promise.reject(error);
    },
  );
};

export default apiClient;
