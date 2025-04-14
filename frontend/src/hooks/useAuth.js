/**
 * Custom hook for accessing authentication context
 */

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Hook for easy access to authentication context values
 * @returns {Object} Authentication context values
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default useAuth;
