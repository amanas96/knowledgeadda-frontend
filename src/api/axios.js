import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  eaders: { "Content-Type": "application/json" },
});

// This function lets us set up the interceptors
export const setupInterceptors = (logout) => {
  apiClient.interceptors.response.use(
    (response) => response,

    (error) => {
      if (error.response && error.response.status === 401) {
        console.log("Auth error, logging out...");
        logout();
      }

      return Promise.reject(error);
    }
  );
};

export default apiClient;
