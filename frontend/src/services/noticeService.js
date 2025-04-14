// src/services/noticeService.js
import axios from "axios";
import { NOTICE_ENDPOINTS } from "../constants/apiEndpoints";
import { getAuthToken } from "./api";

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/png'
];

/**
 * Validates a file before upload
 * @param {File} file - The file to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
const validateFile = (file) => {
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 5MB';
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Invalid file type. Allowed types: PDF, DOC, DOCX, TXT, JPG, PNG';
  }
  return null;
};

/**
 * Service for Notice-related API operations
 * Handles creating, reading, updating, and deleting notices
 */
export const noticeService = {
  /**
   * Get notices created by all users
   * @returns {Promise<Array>} Array of all notices
   */
  getAllNotices: async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(NOTICE_ENDPOINTS.GET_ALL_NOTICES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Ensure the response has the expected format
      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching all notices:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch notices",
        error: error.message
      };
    }
  },

  /**
   * Get notices created by the current user (for teachers)
   * @returns {Promise<Array>} Array of user's notices
   */
  getUserNotices: async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(NOTICE_ENDPOINTS.GET_USER_NOTICES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch user notices" };
    }
  },

  /**
   * Create a new notice (teachers only)
   * @param {FormData} formData - Form data for the new notice
   * @returns {Promise<Object>} Created notice data
   */
  createNotice: async (formData) => {
    try {
      const file = formData.get('file');
      if (file) {
        const validationError = validateFile(file);
        if (validationError) {
          throw new Error(validationError);
        }
      }

      // Validate required fields
      const title = formData.get('title');
      const content = formData.get('content');
      const departmentid = formData.get('departmentid');

      if (!title || !content || !departmentid) {
        throw new Error("Title, content, and department are required");
      }

      const token = getAuthToken();
      const response = await axios.post(NOTICE_ENDPOINTS.CREATE_NOTICE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Error creating notice:", error);
      throw error.response?.data || { message: "Failed to create notice" };
    }
  },

  /**
   * Update an existing notice (teachers only)
   * @param {string} id - ID of notice to update
   * @param {FormData} formData - Form data for the updated notice
   * @returns {Promise<Object>} Updated notice data
   */
  updateNotice: async (id, formData) => {
    try {
      const file = formData.get('file');
      if (file) {
        const validationError = validateFile(file);
        if (validationError) {
          throw new Error(validationError);
        }
      }

      const token = getAuthToken();
      const response = await axios.put(
        NOTICE_ENDPOINTS.UPDATE_NOTICE(id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message || "Failed to update notice" };
    }
  },

  /**
   * Delete a notice (teachers only)
   * @param {string} noticeId - ID of notice to delete
   * @returns {Promise<boolean>} Success status
   */
  deleteNotice: async (noticeId) => {
    try {
      const token = getAuthToken();
      await axios.delete(NOTICE_ENDPOINTS.DELETE_NOTICE(noticeId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete notice" };
    }
  },

  /**
   * Download a notice attachment
   * @param {string} noticeId - ID of the notice
   * @param {string} filename - Name of the file to download
   * @returns {Promise<Blob>} File blob
   */
  downloadAttachment: async (noticeId, filename) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        NOTICE_ENDPOINTS.DOWNLOAD_ATTACHMENT(noticeId, filename),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to download attachment" };
    }
  },
};
