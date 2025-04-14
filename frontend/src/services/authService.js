/**
 * Authentication Service
 * Handles user authentication API calls and token management
 */

import apiService, { setAuthToken, getAuthToken } from "./api";
import { AUTH_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Authentication service with methods for login, signup, and session management
 */
export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.username - Username
   * @param {string} userData.password - User password
   * @param {string} userData.usertype - User role type
   * @param {string} [userData.departmentid] - Department ID (required for students/teachers)
   * @returns {Promise<Object>} User data and token
   */
  signup: async (userData) => {
    try {
      // Ensure all data is properly formatted
      const apiData = {
        email: userData.email.trim(),
        username: userData.username.trim(),
        password: userData.password,
        usertype: userData.usertype.toUpperCase(),
        departmentid: userData.usertype.toUpperCase() === 'ADMIN' ? null : Number(userData.departmentid)
      };

      // Validate departmentid for non-admin users
      if (apiData.usertype !== 'ADMIN' && (isNaN(apiData.departmentid) || apiData.departmentid <= 0)) {
        throw new Error('Invalid department ID');
      }

      console.log("Signup data being sent:", apiData);
      const response = await apiService.post(AUTH_ENDPOINTS.SIGNUP, apiData);
      
      // Check if we have a valid response
      if (!response) {
        throw new Error('No response received from server');
      }

      // The response might be in response.data or directly in response
      const responseData = response.data || response;
      
      if (!responseData) {
        throw new Error('No response data received from server');
      }

      console.log("Signup response:", responseData);
      
      if (responseData.token) {
        setAuthToken(responseData.token);
      }
      
      return responseData;
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        
        // If we have a specific error message from the backend, use it
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw error;
    }
  },

  /**
   * Log in an existing user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} User data and token
   */
  login: async (credentials) => {
    try {
      console.log("Sending login request with:", credentials);
      const response = await apiService.post(AUTH_ENDPOINTS.LOGIN, credentials);
      console.log("Complete response object:", JSON.stringify(response));
      console.log("Raw login API response:", response);

      // Handle different response formats - direct object or nested data object
      const token = response.token || (response.data && response.data.token);

      if (!token) {
        console.error("Invalid response format, missing token:", response);
        throw new Error("Invalid login response format");
      }

      setAuthToken(token);
      return response.data || response; // Return appropriate response format
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Get current user profile data
   * @returns {Promise<Object>} Current user data
   */

  getCurrentUser: async () => {
    try {
      if (!AUTH_ENDPOINTS.CURRENT_USER) {
        console.error("Current user endpoint is undefined!");
        throw new Error(
          "API endpoint for current user is not properly configured"
        );
      }
      return await apiService.get(AUTH_ENDPOINTS.CURRENT_USER);
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  },

  /**
   * Log out the current user
   * @returns {Promise<Object>} Logout confirmation
   */
  logout: async () => {
    try {
      // Call logout endpoint if server needs to invalidate session
      await apiService.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.warn("Logout API error:", error);
      // Continue with local logout even if API call fails
    }

    // Always clear local token
    setAuthToken(null);
    return { success: true, message: "Logged out successfully" };
  },

  /**
   * Initiate Google OAuth authentication
   * @returns {string} Google auth URL
   */
  googleAuth: () => {
    return AUTH_ENDPOINTS.GOOGLE_AUTH;
  },

  /**
   * Process Google OAuth callback
   * @param {string} code - Authorization code from Google
   * @returns {Promise<Object>} User data and token
   */
  handleGoogleCallback: async (code) => {
    try {
      const response = await apiService.post(AUTH_ENDPOINTS.GOOGLE_CALLBACK, {
        code,
      });
      if (response.token) {
        setAuthToken(response.token);
      }
      return response;
    } catch (error) {
      console.error("Google auth callback error:", error);
      throw error;
    }
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  changePassword: async (passwordData) => {
    try {
      return await apiService.post(
        AUTH_ENDPOINTS.CHANGE_PASSWORD,
        passwordData
      );
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  },

  /**
   * Change user email
   * @param {Object} emailData - Email change data
   * @param {string} emailData.password - Current password for verification
   * @param {string} emailData.newEmail - New email address
   * @returns {Promise<Object>} Success message
   */
  changeEmail: async (emailData) => {
    try {
      return await apiService.post(AUTH_ENDPOINTS.CHANGE_EMAIL, emailData);
    } catch (error) {
      console.error("Change email error:", error);
      throw error;
    }
  },

  /**
   * Check if user is currently authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  /**
   * Get current authentication token
   * @returns {string|null} Current token or null
   */
  getToken: () => {
    return getAuthToken();
  },
};
