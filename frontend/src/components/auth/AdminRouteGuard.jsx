import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Spinner from "../common/Spinner";

/**
 * Component to protect admin-only routes
 * Redirects to login if user is not authenticated or to dashboard if user is not an admin
 */
const AdminRouteGuard = () => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role, redirect to dashboard if not
  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is authenticated and has admin role, render the child routes
  return <Outlet />;
};

export default AdminRouteGuard;
