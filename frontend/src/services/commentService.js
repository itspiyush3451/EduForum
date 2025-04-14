import api from "./api";
import { COMMENT_ENDPOINTS } from "../constants/apiEndpoints";
/**
 * Create a new comment for a post
 * @param {number} postId - ID of the post to comment on
 * @param {string} content - Content of the comment
 * @param {number} departmentId - Optional department ID
 * @returns {Promise} - Promise resolving to the created comment
 */
export const createComment = async (postId, content, departmentId = null) => {
  try {
    const payload = {
      postid: postId,
      content: content,
    };

    // Add department ID if provided
    if (departmentId) {
      payload.departmentid = departmentId;
    }

    const response = await api.post(COMMENT_ENDPOINTS.COMMENTS.CREATE, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};
/**
 * Get all comments for a specific post
 * @param {number} postId - ID of the post to get comments for
 * @returns {Promise} - Promise resolving to an array of comments
 */
export const getPostComments = async (postId) => {
  try {
    console.log('Fetching comments for post:', postId);
    const response = await api.get(COMMENT_ENDPOINTS.COMMENTS.GET_POST_COMMENTS(postId));
    console.log('Raw API Response:', response);
    
    // Handle different response structures
    let comments = [];
    if (response.data && response.data.comments) {
      comments = response.data.comments;
    } else if (Array.isArray(response.data)) {
      comments = response.data;
    } else if (response.comments) {
      comments = response.comments;
    } else if (response.data) {
      comments = response.data;
    }
    
    console.log('Processed comments:', comments);
    return comments;
  } catch (error) {
    console.error("Error fetching post comments:", error);
    throw error;
  }
};
/**
 * Update an existing comment
 * @param {number} commentId - ID of the comment to update
 * @param {string} content - New content for the comment
 * @returns {Promise} - Promise resolving to the updated comment
 */
export const updateComment = async (commentId, content) => {
  try {
    const response = await api.put(COMMENT_ENDPOINTS.COMMENTS.UPDATE(commentId), { content });
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};
/**
 * Delete a comment
 * @param {number} commentId - ID of the comment to delete
 * @returns {Promise} - Promise resolving to success message
 */
export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(COMMENT_ENDPOINTS.COMMENTS.DELETE(commentId));
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
export default {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
};
