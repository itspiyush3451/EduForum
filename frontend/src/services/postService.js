// src/services/postService.js
import axios from "axios";
import { POST_ENDPOINTS } from "../constants/apiEndpoints";
import { getAuthToken } from "./api";
import { DEPARTMENT_ENDPOINTS } from "../constants/apiEndpoints";
// Create reusable API service for Post-related operations
export const postService = {
  /**
   * Create a new post
   * @param {Object} postData - Data for the new post
   * @returns {Promise<Object>} - Created post data
   */
  createPost: async (postData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw { message: "Please log in to create a post" };
      }
      
      const response = await axios.post(POST_ENDPOINTS.CREATE_POST, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw { message: "Failed to create post" };
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw { message: "Your session has expired. Please log in again." };
      } else if (error.response?.status === 403) {
        throw { message: "You don't have permission to create posts in this department" };
      } else if (error.response?.status === 400) {
        throw { message: error.response.data.message || "Invalid post data. Please check your input." };
      }
      throw error.response?.data || error;
    }
  },

  /**
   * Update an existing post
   * @param {string} postId - ID of post to update
   * @param {Object} postData - Updated post data
   * @returns {Promise<Object>} - Updated post data
   */
  updatePost: async (postId, postData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw { message: "Please log in to update the post" };
      }

      console.log('Updating post with ID:', postId);
      console.log('Update data:', postData);

      // Include all necessary fields in the update data
      const updateData = {
        content: postData.content,
        title: postData.title,
        departmentid: postData.departmentid
      };

      console.log('Sending update request with data:', updateData);

      // Perform the update
      const updateResponse = await axios.put(
        POST_ENDPOINTS.UPDATE_POST(postId),
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log('Update response:', updateResponse.data);

      if (!updateResponse.data) {
        throw { message: "Failed to update post" };
      }

      // Handle different response structures
      let updatedPost;
      if (updateResponse.data.success) {
        updatedPost = updateResponse.data.data;
      } else if (Array.isArray(updateResponse.data)) {
        updatedPost = updateResponse.data[0];
      } else {
        updatedPost = updateResponse.data;
      }

      console.log('Processed updated post:', updatedPost);
      return updatedPost;
    } catch (error) {
      console.error("Error updating post:", error);
      if (error.response?.status === 401) {
        throw { message: "Your session has expired. Please log in again." };
      } else if (error.response?.status === 403) {
        throw { message: "You don't have permission to update this post" };
      } else if (error.response?.status === 404) {
        throw { message: "Post not found" };
      } else if (error.response?.status === 400) {
        throw { message: error.response.data.message || "Invalid post data. Please check your input." };
      }
      throw error.response?.data || error;
    }
  },

  /**
   * Delete a post
   * @param {string} postId - ID of post to delete
   * @returns {Promise<boolean>} - Success status
   */
  deletePost: async (postId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw { message: "Please log in to delete the post" };
      }
      const response = await axios.delete(POST_ENDPOINTS.DELETE_POST(postId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data?.success || true;
    } catch (error) {
      if (error.response?.status === 401) {
        throw { message: "Your session has expired. Please log in again." };
      } else if (error.response?.status === 403) {
        throw { message: "You don't have permission to delete this post" };
      } else if (error.response?.status === 404) {
        throw { message: "Post not found" };
      }
      throw error.response?.data || { message: "Failed to delete post. Please try again." };
    }
  },

  /**
   * Get all posts
   * @returns {Promise<Array>} - Array of posts
   */
  getAllPosts: async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw { message: "Authentication token not found" };
      }
      const response = await axios.get(POST_ENDPOINTS.GET_ALL_POSTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Handle both array and object response structures
      let posts = [];
      if (response.data && response.data.success) {
        posts = Array.isArray(response.data.data) ? response.data.data : [];
      } else {
        posts = Array.isArray(response.data) ? response.data : [];
      }
      
      // Remove the department filtering here since we want to show all posts
      // and let the frontend handle the filtering
      return posts;
    } catch (error) {
      console.error("Error in getAllPosts:", error);
      if (error.response?.status === 401) {
        throw { message: "Your session has expired. Please log in again." };
      }
      return [];
    }
  },

  /**
   * Get posts by current user
   * @returns {Promise<Array>} - Array of user's posts
   */
  getUserPosts: async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw { message: "Authentication token not found" };
      }
      const response = await axios.get(POST_ENDPOINTS.GET_USER_POSTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Log the response for debugging
      console.log('getUserPosts response:', response.data);
      
      // Handle different response structures
      if (response.data && response.data.success) {
        return Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.data) {
        return [response.data.data];
      }
      return [];
    } catch (error) {
      console.error("Error in getUserPosts:", error);
      if (error.response?.status === 401) {
        throw { message: "Your session has expired. Please log in again." };
      }
      return [];
    }
  },

  /**
   * Get a post by ID
   * @param {string} postId - ID of post to fetch
   * @returns {Promise<Object>} - Post data
   */
  getPostById: async (postId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw { message: "Authentication token not found" };
      }

      const response = await axios.get(POST_ENDPOINTS.GET_POST_BY_ID(postId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw { message: "Post not found" };
      }

      // If the response has a success property, return the data property
      if (response.data.hasOwnProperty('success')) {
        if (!response.data.success) {
          throw { message: response.data.message || "Failed to fetch post" };
        }
        return response.data.data;
      }

      // If we get here, assume the response.data is the post object
      return response.data;
    } catch (error) {
      console.error("Error in getPostById:", error);
      if (error.response?.status === 401) {
        throw { message: "Your session has expired. Please log in again." };
      } else if (error.response?.status === 404) {
        throw { message: "Post not found" };
      }
      throw error.response?.data || error;
    }
  },

  /**
   * Get all departments
   * @returns {Promise<Array>} - Array of departments
   */
  getAllDepartments: async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw { message: "Authentication token not found" };
      }
      const response = await axios.get(DEPARTMENT_ENDPOINTS.GET_ALL_DEPARTMENTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Handle both array and object response structures
      if (response.data && response.data.success) {
        return Array.isArray(response.data.data) ? response.data.data : [];
      }
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error in getAllDepartments:", error);
      if (error.response?.status === 401) {
        throw { message: "Your session has expired. Please log in again." };
      }
      return [];
    }
  },
};
