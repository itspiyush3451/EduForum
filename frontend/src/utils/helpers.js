/**
 * General Utility Functions for EduForum
 * Provides reusable helper methods across the application
 */

import { USER_ROLES, ROLE_LEVELS } from "../constants/roles";
import { getAuthToken } from "../services/api";

/**
 * Format date to a user-friendly string
 * @param {string|Date} dateString - Date string or Date object
 * @param {boolean} includeTime - Whether to include time in the formatted string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, includeTime = false) => {
  try {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
    };
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString || "Invalid date";
  }
};

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Check if user has permission based on role
 * @param {string} userRole - Current user's role
 * @param {string} requiredRole - Minimum required role
 * @returns {boolean} Whether user has sufficient permissions
 */
export const checkPermission = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
};

/**
 * Get role label for display
 * @param {string} role - Role constant
 * @returns {string} Formatted role label
 */
export const getRoleLabel = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "Admin";
    case USER_ROLES.TEACHER:
      return "Teacher";
    case USER_ROLES.STUDENT:
      return "Student";
    default:
      return "User";
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} Whether user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Get initials from name for avatars
 * @param {string} name - User's name or username
 * @returns {string} User's initials (up to 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate a random color based on string
 * @param {string} str - Input string to generate color from
 * @returns {string} HEX color code
 */
export const stringToColor = (str) => {
  if (!str) return "#6C757D"; // Default gray

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }

  return color;
};

/**
 * Safely parse JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} Parsed object or default value
 */
export const safeJsonParse = (jsonString, defaultValue = {}) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return defaultValue;
  }
};

/**
 * Debounce function to limit execution frequency
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Create query string from object of parameters
 * @param {Object} params - Parameters object
 * @returns {string} URL query string
 */
export const createQueryString = (params) => {
  return Object.keys(params)
    .filter(
      (key) =>
        params[key] !== undefined && params[key] !== null && params[key] !== ""
    )
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
};

export default {
  formatDate,
  truncateText,
  checkPermission,
  getRoleLabel,
  isAuthenticated,
  getInitials,
  stringToColor,
  safeJsonParse,
  debounce,
  createQueryString,
};
