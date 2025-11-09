import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// This function lets us set up the interceptors
export const setupInterceptors = (logout) => {
  apiClient.interceptors.response.use(
    // 1. If the request is successful, just return the response
    (response) => response,

    // 2. If the request fails...
    (error) => {
      // Check if it's a 401 Unauthorized error
      if (error.response && error.response.status === 401) {
        console.log("Auth error, logging out...");
        logout(); // Call the logout function from AuthContext
      }

      // Return the error to be handled by the component
      return Promise.reject(error);
    }
  );
};

export default apiClient;
