import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";

/**
 * Component for protecting routes based on authentication status and user roles
 * @param {Object} props - Component props
 * @param {Array} props.allowedRoles - Array of roles allowed to access the route
 * @returns {JSX.Element} Protected route or redirect
 */
const PrivateRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading state if auth is still initializing
  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if the current path is a public route
  const publicPaths = ['/login', '/signup', '/signup/student', '/signup/teacher', '/signup/admin'];
  const isPublicPath = publicPaths.some(path => location.pathname.startsWith(path));
  
  if (isPublicPath) {
    return <Outlet />;
  }

  // For protected routes, check authentication
  if (!user) {
    // Redirect to login if not authenticated, preserving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles?.length > 0) {
    const userRole = user.usertype || user.role;
    if (!allowedRoles.includes(userRole)) {
      // Redirect to unauthorized page if the role is not allowed
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
