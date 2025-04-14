/**
 * Authentication Context
 * Provides authentication state management throughout the application
 */

import React, { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { authService } from "../services/authService";
import { USER_ENDPOINTS } from "../constants/apiEndpoints";
import axios from "axios";
import { USER_ROLES } from "../constants/roles";
import { useNavigate } from "react-router-dom";

// Create Auth Context
export const AuthContext = createContext();

/**
 * Authentication Provider Component
 * Manages authentication state and provides auth-related methods
 */
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  // User state
  const [user, setUser] = useState(null);
  // Loading state for auth operations
  const [loading, setLoading] = useState(true);
  // Error state for auth operations
  const [error, setError] = useState(null);

  const fetchUserProfile = async (token) => {
    try {
      console.log("Fetching user profile with token:", token);
      const response = await axios.get("http://localhost:3000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User profile response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
      return null;
    }
  };

  // Initialize auth state from local storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        // Decode the JWT token to get user information
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        
        // Check if token is expired
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        if (Date.now() >= expirationTime) {
          console.log("Token expired, logging out");
          localStorage.removeItem("token");
          localStorage.removeItem("user_data");
          setLoading(false);
          return;
        }
        
        // Try to fetch user profile data
        const profileData = await fetchUserProfile(token);
        
        if (profileData?.success) {
          const userData = {
            id: profileData.data.userid || payload.userid || "unknown",
            username: profileData.data.username || payload.username || "unknown",
            usertype: profileData.data.usertype || payload.userType || "ADMIN",
            role: profileData.data.usertype || payload.userType || "ADMIN",
            departmentid: Number(profileData.data.departmentid),
            token: token,
          };
          setUser(userData);
          localStorage.setItem("user_data", JSON.stringify(userData));
        } else {
          // Fallback to stored user data if profile fetch fails
          const storedUser = localStorage.getItem("user_data");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user_data");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login handler
   * @param {Object} credentials - User login credentials
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      console.log("Login response data:", response);
      
      // Extract token and ensure usertype is consistent with what's in the token
      const token = response.token;

      if (token) {
        localStorage.setItem("token", token);
        
        // Try to fetch user profile data first
        const profileData = await fetchUserProfile(token);
        console.log("Profile data from API:", profileData);
        
        // Decode the JWT token to get user information
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log("Complete token on login:", token);
        console.log("Complete decoded token payload on login:", payload);
        
        if (!profileData?.success) {
          console.error("Failed to fetch user profile:", profileData);
          // If profile fetch fails, try to use token data
          const userData = {
            id: payload.userid || "unknown",
            username: payload.username || credentials.identifier,
            usertype: payload.userType || "ADMIN",
            role: payload.userType || "ADMIN",
            departmentid: null, // We'll need to fetch this later
            token: token,
          };
          
          console.log("Fallback user data from token:", userData);
          setUser(userData);
          localStorage.setItem("user_data", JSON.stringify(userData));
          
          if(userData.usertype === "ADMIN"){
            navigate("/admin");
          }else{
            navigate("/dashboard");
          }
          return { ...response, user: userData };
        }

        // Use profile data if available
        const userData = {
          id: profileData.data.userid || payload.userid || "unknown",
          username: profileData.data.username || payload.username || credentials.identifier,
          usertype: profileData.data.usertype || payload.userType || "ADMIN",
          role: profileData.data.usertype || payload.userType || "ADMIN",
          departmentid: Number(profileData.data.departmentid),
          token: token,
        };
        
        console.log("Final user data being set:", userData);

        setUser(userData);
        localStorage.setItem("user_data", JSON.stringify(userData));
        
        if(userData.usertype === "ADMIN"){
          navigate("/admin");
        }else{
          navigate("/dashboard");
        }
        return { ...response, user: userData };
      } else {
        throw new Error("Invalid response format, missing token");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Google Login handler
   * Initiates Google OAuth flow
   */
  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get Google auth URL
      const authUrl = authService.googleAuth();
      // Redirect to Google auth
      window.location.href = authUrl;
      return { success: true }; // This won't actually be returned due to redirect
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Signup handler
   * @param {Object} userData - User registration data
   */
  const signup = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.signup(userData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(async () => {
    setLoading(true);

    try {
      await authService.logout();
      setUser(null);
      // Remove stored user data
      localStorage.removeItem("user_data");
      localStorage.removeItem("token");
    } catch (err) {
      console.error("Logout error:", err);
      // Still clear user state even if API call fails
      setUser(null);
      localStorage.removeItem("user_data");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update user data
   * @param {Object} userData - Updated user data
   */
  const updateUser = useCallback((userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }));

    // Update stored user data
    const storedUser = JSON.parse(localStorage.getItem("user_data") || "{}");
    localStorage.setItem(
      "user_data",
      JSON.stringify({
        ...storedUser,
        ...userData,
      })
    );
  }, []);

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean} Whether user has the role
   */
  const hasRole = useCallback(
    (role) => {
      if (!user) return false;
      return user.role === role;
    },
    [user]
  );

  /**
   * Check if user has admin access
   * @returns {boolean} Whether user has admin access
   */
  const isAdmin = useCallback(() => {
    console.log("isAdmin called, user:", user);
    console.log("user.role:", user?.role);
    console.log("user.usertype:", user?.usertype);
    console.log("USER_ROLES.ADMIN:", USER_ROLES.ADMIN);
    const isAdminUser = user?.role === USER_ROLES.ADMIN || user?.usertype === USER_ROLES.ADMIN;
    console.log("isAdmin result:", isAdminUser);
    return isAdminUser;
  }, [user]);

  /**
   * Check if user has teacher access
   * @returns {boolean} Whether user has teacher access
   */
  const isTeacher = useCallback(() => {
    return hasRole(USER_ROLES.TEACHER) || hasRole(USER_ROLES.ADMIN);
  }, [hasRole]);

  /**
   * Get the current user's role
   * @returns {string|null} The role of the user or null if not authenticated
   */
  const getUserRole = useCallback(() => {
    return user?.usertype || null;
  }, [user]);

  // Auth context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUser,
    hasRole,
    isAdmin,
    isTeacher,
    getUserRole,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
