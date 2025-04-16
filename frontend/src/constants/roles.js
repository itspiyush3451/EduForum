/**
 * User Role Constants for EduForum
 * Defines the application user role types and access levels
 */

// User role types - matching those specified in the API
export const USER_ROLES = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN",
};

// Role access levels (numeric values for comparison)
export const ROLE_LEVELS = {
  [USER_ROLES.STUDENT]: 1,
  [USER_ROLES.TEACHER]: 2,
  [USER_ROLES.ADMIN]: 3,
};

// Role descriptions for UI display
export const ROLE_DESCRIPTIONS = {
  [USER_ROLES.STUDENT]: "Student user with basic access",
  [USER_ROLES.TEACHER]: "Teacher with notice creation abilities",
  [USER_ROLES.ADMIN]: "Administrator with full system access",
};

// Permission helper functions
export const hasAdminAccess = (userRole) => userRole === USER_ROLES.ADMIN;
export const hasTeacherAccess = (userRole) =>
  userRole === USER_ROLES.TEACHER || userRole === USER_ROLES.ADMIN;
export const canCreateNotice = (userRole) =>
  userRole === USER_ROLES.TEACHER || userRole === USER_ROLES.ADMIN;
export const canManageDepartments = (userRole) => userRole === USER_ROLES.ADMIN;

export default USER_ROLES;
