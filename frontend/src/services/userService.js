import { apiService } from './api';
import { USER_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * Service for handling user-related API calls
 */
export const userService = {
  /**
   * Get the current user's profile information
   * @returns {Promise} Promise object representing the user profile data
   */
  getUserProfile: async () => {
    try {
      const response = await apiService.get("/users/profile");
      console.log("User profile response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  /**
   * Update the current user's profile information
   * @param {Object} profileData - The user profile data to update
   * @param {string} profileData.username - User's display name
   * @param {string} profileData.email - User's email address
   * @param {number} profileData.departmentId - User's department ID
   * @returns {Promise} Promise object representing the updated user profile
   */
  updateUserProfile: async (profileData) => {
    const response = await apiService.put("/users/profile", profileData);
    return response.data;
  },

  /**
   * Change the current user's password
   * @param {Object} passwordData - The password data
   * @param {string} passwordData.oldPassword - User's current password
   * @param {string} passwordData.newPassword - User's new password
   * @returns {Promise} Promise object representing the result of the operation
   */
  changePassword: async (passwordData) => {
    const response = await apiService.put("/users/changepassword", passwordData);
    return response.data;
  },

  /**
   * Change the current user's email address
   * @param {Object} emailData - The email data
   * @param {string} emailData.newEmail - User's new email address
   * @returns {Promise} Promise object representing the result of the operation
   */
  changeEmail: async (emailData) => {
    const response = await apiService.post("/users/changeemail", emailData);
    return response.data;
  },

  /**
   * Admin only: Get all users
   * @returns {Promise} Promise object representing all users' data
   */
  getAllUsers: async () => {
    try {
      const response = await apiService.get('/users/admin/users');
      console.log("getAllUsers raw response:", response);
      
      // Handle different response structures
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      } else if (response && response.users) {
        return response.users;
      } else if (response && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      
      console.warn("Unexpected response format:", response);
      return [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  /**
   * Admin only: Update user role
   * @param {string} username - Username of the user to update
   * @param {string} role - New role to assign (STUDENT/TEACHER/ADMIN)
   * @returns {Promise} Promise object representing the result of the operation
   */
  updateUserRole: async (username, role) => {
    const response = await apiService.put(`/users/admin/user/${username}/role`, {
      newRole: role,
    });
    return response.data;
  },

  /**
   * Admin only: Delete a user
   * @param {string} username - Username of the user to delete
   * @returns {Promise} Promise object representing the result of the operation
   */
  deleteUserByUsername: async (username) => {
    const response = await apiService.delete(`/users/admin/user/${username}`);
    return response.data;
  },

  getUserById: async (id) => {
    try {
      // First try to get user from the admin endpoint
      const response = await apiService.get(`/users/admin/user/${id}`);
      if (response.data && response.data.username) {
        return response;
      }
      // If that fails, try the profile endpoint
      const profileResponse = await apiService.get(`/users/profile/${id}`);
      if (profileResponse.data && profileResponse.data.username) {
        return profileResponse;
      }
      // If both fail, return a default user
      return {
        data: {
          username: 'Anonymous',
          userid: id
        }
      };
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      // Return a default user object if the request fails
      return {
        data: {
          username: 'Anonymous',
          userid: id
        }
      };
    }
  },

  createUser: async (userData) => {
    return apiService.post('/users', userData);
  },

  updateUser: async (id, userData) => {
    return apiService.put(`/users/${id}`, userData);
  },

  deleteUserById: async (id) => {
    return apiService.delete(`/users/${id}`);
  }
};
