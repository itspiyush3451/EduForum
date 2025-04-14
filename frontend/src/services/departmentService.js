import { apiService } from './api';

/**
 * Service for handling department-related API calls
 */
export const departmentService = {
  /**
   * Get all departments
   * @returns {Promise} Promise object representing all departments
   */
  getAllDepartments: async () => {
    try {
      const response = await apiService.get('/departments');
      console.log("getAllDepartments response:", response);
      // Handle different response structures
      if (response && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }
  },

  /**
   * Get a specific department by ID
   * @param {number} departmentId - The ID of the department to retrieve
   * @returns {Promise} Promise object representing the department data
   */
  getDepartmentById: async (departmentId) => {
    try {
      const response = await apiService.get(`/departments/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${departmentId}:`, error);
      throw error;
    }
  },

  /**
   * Admin only: Create a new department
   * @param {Object} departmentData - The department data
   * @param {string} departmentData.name - Department name
   * @param {string} departmentData.description - Department description (optional)
   * @returns {Promise} Promise object representing the created department
   */
  createDepartment: async (departmentData) => {
    try {
      const response = await apiService.post('/departments', departmentData);
      return response.data;
    } catch (error) {
      console.error("Error in createDepartment:", error);
      throw error;
    }
  },

  /**
   * Admin only: Update an existing department
   * @param {number} departmentId - The ID of the department to update
   * @param {Object} departmentData - The updated department data
   * @param {string} departmentData.name - Department name
   * @param {string} departmentData.description - Department description (optional)
   * @returns {Promise} Promise object representing the updated department
   */
  updateDepartment: async (departmentId, departmentData) => {
    try {
      const response = await apiService.put(`/departments/${departmentId}`, departmentData);
      return response.data;
    } catch (error) {
      console.error("Error in updateDepartment:", error);
      throw error;
    }
  },

  /**
   * Admin only: Delete a department
   * @param {number} departmentId - The ID of the department to delete
   * @returns {Promise} Promise object representing the result of the operation
   */
  deleteDepartment: async (departmentId) => {
    try {
      const response = await apiService.delete(`/departments/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error("Error in deleteDepartment:", error);
      throw error;
    }
  },
};
