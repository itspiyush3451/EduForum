/**
 * Form Validation Helpers for EduForum
 * Provides reusable validation functions for forms
 */

import { USER_ROLES } from "../constants/roles";

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Invalid email format";
  return "";
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/(?=.*[a-z])/.test(password))
    return "Password must include lowercase letters";
  if (!/(?=.*[A-Z])/.test(password))
    return "Password must include uppercase letters";
  if (!/(?=.*\d)/.test(password))
    return "Password must include at least one number";
  return "";
};

// Username validation
export const validateUsername = (username) => {
  if (!username) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (username.length > 20) return "Username must be less than 20 characters";
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return "Username can only contain letters, numbers, and underscores";
  return "";
};

// Role validation
export const validateRole = (role) => {
  if (!role) return "Role is required";
  if (!Object.values(USER_ROLES).includes(role)) return "Invalid user role";
  return "";
};

// Department validation
export const validateDepartment = (departmentId, userRole) => {
  // Department is required for students and teachers
  if (
    (userRole === USER_ROLES.STUDENT || userRole === USER_ROLES.TEACHER) &&
    !departmentId
  ) {
    return "Department is required for students and teachers";
  }
  return "";
};

// Post content validation
export const validatePostContent = (content) => {
  if (!content) return "Post content is required";
  if (content.length < 5) return "Post content is too short";
  if (content.length > 5000)
    return "Post content cannot exceed 5000 characters";
  return "";
};

// Notice validation
export const validateNotice = (title, content) => {
  const errors = {};

  if (!title) errors.title = "Notice title is required";
  else if (title.length < 3) errors.title = "Title is too short";
  else if (title.length > 100)
    errors.title = "Title cannot exceed 100 characters";

  if (!content) errors.content = "Notice content is required";
  else if (content.length < 10) errors.content = "Content is too short";
  else if (content.length > 10000)
    errors.content = "Content cannot exceed 10000 characters";

  return errors;
};

// Comment validation
export const validateComment = (content) => {
  if (!content) return "Comment content is required";
  if (content.length < 2) return "Comment is too short";
  if (content.length > 1000) return "Comment cannot exceed 1000 characters";
  return "";
};

// Department validation for create/edit
export const validateDepartmentForm = (name, description) => {
  const errors = {};

  if (!name) errors.name = "Department name is required";
  else if (name.length < 2) errors.name = "Name is too short";
  else if (name.length > 50) errors.name = "Name cannot exceed 50 characters";

  if (description && description.length > 200) {
    errors.description = "Description cannot exceed 200 characters";
  }

  return errors;
};

// Signup form validation
export const validateSignupForm = (formData) => {
  const { email, username, password, usertype, departmentid } = formData;
  const errors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const usernameError = validateUsername(username);
  if (usernameError) errors.username = usernameError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  const roleError = validateRole(usertype);
  if (roleError) errors.usertype = roleError;

  const departmentError = validateDepartment(departmentid, usertype);
  if (departmentError) errors.departmentid = departmentError;

  return errors;
};

// Login form validation
export const validateLoginForm = (formData) => {
  const { email, password } = formData;
  const errors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) errors.password = "Password is required";

  return errors;
};

export default {
  validateEmail,
  validatePassword,
  validateUsername,
  validateRole,
  validateDepartment,
  validatePostContent,
  validateNotice,
  validateComment,
  validateDepartmentForm,
  validateSignupForm,
  validateLoginForm,
};
