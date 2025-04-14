/**
 * API Service Configuration
 * Configures Axios instance with interceptors for authentication and error handling
 */

import axios from "axios";

// Get configuration from Vite environment variables
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;
const AUTH_TOKEN_NAME =
  import.meta.env.VITE_AUTH_TOKEN_NAME || "token";
const TOKEN_EXPIRY_REDIRECT =
  import.meta.env.VITE_TOKEN_EXPIRY_REDIRECT === "true";

// Create axios instance with default configs
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: parseInt(API_TIMEOUT, 10),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Auth token storage methods
export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_NAME);
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_NAME, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_NAME);
  }
};

// Add request interceptor to inject auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error("Network error:", error);
    }
    // Handle unauthorized errors (401)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Get the token from localStorage
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          // Decode the JWT token to check expiration
          const tokenParts = token.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          const expirationTime = payload.exp * 1000; // Convert to milliseconds
          
          // Only redirect to login if token is actually expired
          if (Date.now() >= expirationTime) {
            console.log("Token expired, redirecting to login");
            setAuthToken(null);
            localStorage.removeItem("user_data");
            
            // Don't redirect if we're on the login or signup page
            if (
              TOKEN_EXPIRY_REDIRECT &&
              !window.location.pathname.includes("/login") &&
              !window.location.pathname.includes("/signup") &&
              !window.location.pathname.includes("/notices/create")
            ) {
              window.location.href = "/login";
            }
          } else {
            // Token is not expired, but request failed - might be invalid token
            console.error("Invalid token, but not expired");
            setAuthToken(null);
            localStorage.removeItem("user_data");
          }
        } catch (err) {
          console.error("Error checking token expiration:", err);
          // If we can't decode the token, it's invalid
          setAuthToken(null);
          localStorage.removeItem("user_data");
        }
      }

      return Promise.reject(error);
    }

    // Handle forbidden errors (403)
    if (error.response && error.response.status === 403) {
      console.error("Permission denied");
      // Optionally redirect to a permission denied page
      // window.location.href = '/permission-denied';
    }

    // Server error handling (500)
    if (error.response && error.response.status >= 500) {
      console.error("Server error:", error.response.data);
      // You might want to show a generic server error message
    }

    return Promise.reject(error);
  }
);

// Export the configured axios instance
export const apiService = {
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      console.error(`GET request to ${url} failed:`, error);
      throw error;
    }
  },
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`POST request to ${url} failed:`, error);
      throw error;
    }
  },
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`PUT request to ${url} failed:`, error);
      throw error;
    }
  },
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      console.error(`DELETE request to ${url} failed:`, error);
      throw error;
    }
  },
};

export default apiService;
