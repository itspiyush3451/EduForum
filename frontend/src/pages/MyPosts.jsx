import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import MyPostContainer from "../components/posts/MyPostsContainer";

/**
 * MyPosts component that wraps MyPostContainer with authentication checks
 * Ensures only authenticated users can view their posts
 */
const MyPosts = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", {
        replace: true,
        state: {
          from: "/posts/my-posts",
          message: "Please log in to view your posts",
        },
      });
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading state while auth state is being determined
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Only render the container if authenticated
  return isAuthenticated ? (
    <div className="container mx-auto py-8">
      <MyPostContainer />
    </div>
  ) : null;
};

export default MyPosts;
