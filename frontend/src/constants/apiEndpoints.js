/**
 * API Endpoints for EduForum application
 * This file centralizes all API endpoint definitions
 */

// In Vite, environment variables are exposed on import.meta.env instead of process.env
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Authentication
export const AUTH_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/users/signup`,
  LOGIN: `${API_BASE_URL}/users/login`,
  CURRENT_USER: `${API_BASE_URL}/users/me`,
  LOGOUT: `${API_BASE_URL}/users/logout`,
  GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,
  GOOGLE_CALLBACK: `${API_BASE_URL}/auth/google/callback`,
  CHANGE_PASSWORD: `${API_BASE_URL}/users/changepassword`,
  CHANGE_EMAIL: `${API_BASE_URL}/users/changeemail`,
};

// User Management
export const USER_ENDPOINTS = {
  GET_ALL_USERS: `${API_BASE_URL}/users/admin/users`,
  GET_USER_PROFILE: `${API_BASE_URL}/users/me`,
  UPDATE_USER_ROLE: (username) =>
    `${API_BASE_URL}/users/admin/user/${username}/role`,
  DELETE_USER: (username) => `${API_BASE_URL}/users/admin/user/${username}`,
};

// Post Management
export const POST_ENDPOINTS = {
  CREATE_POST: `${API_BASE_URL}/posts/createpost`,
  UPDATE_POST: (postid) => `${API_BASE_URL}/posts/${postid}`,
  DELETE_POST: (postid) => `${API_BASE_URL}/posts/${postid}`,
  GET_USER_POSTS: `${API_BASE_URL}/posts/userposts`,
  GET_ALL_POSTS: `${API_BASE_URL}/posts/all`,
  GET_POST_BY_ID: (postid) => `${API_BASE_URL}/posts/${postid}`,
};

// Notice Management
export const NOTICE_ENDPOINTS = {
  CREATE_NOTICE: `${API_BASE_URL}/notices/create`,
  UPDATE_NOTICE: (noticeid) => `${API_BASE_URL}/notices/${noticeid}`,
  DELETE_NOTICE: (noticeid) => `${API_BASE_URL}/notices/${noticeid}`,
  GET_USER_NOTICES: `${API_BASE_URL}/notices/usernotices`,
  GET_ALL_NOTICES: `${API_BASE_URL}/notices`,
  DOWNLOAD_ATTACHMENT: (noticeId, filename) => `${API_BASE_URL}/notices/${noticeId}/download/${filename}`,
};

// Department Management
export const DEPARTMENT_ENDPOINTS = {
  CREATE_DEPARTMENT: `${API_BASE_URL}/departments`,
  GET_ALL_DEPARTMENTS: `${API_BASE_URL}/departments`,
  GET_DEPARTMENT: (departmentId) =>
    `${API_BASE_URL}/departments/${departmentId}`,
  UPDATE_DEPARTMENT: (departmentId) =>
    `${API_BASE_URL}/departments/${departmentId}`,
  DELETE_DEPARTMENT: (departmentId) =>
    `${API_BASE_URL}/departments/${departmentId}`,
};

// Comments Management
export const COMMENT_ENDPOINTS = {
  COMMENTS: {
    CREATE: `${API_BASE_URL}/comments`,
    GET_POST_COMMENTS: (postid) => `${API_BASE_URL}/comments/post/${postid}`,
    UPDATE: (commentid) => `${API_BASE_URL}/comments/${commentid}`,
    DELETE: (commentid) => `${API_BASE_URL}/comments/${commentid}`,
  },
};

export default {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  POST_ENDPOINTS,
  NOTICE_ENDPOINTS,
  DEPARTMENT_ENDPOINTS,
  COMMENT_ENDPOINTS,
};
