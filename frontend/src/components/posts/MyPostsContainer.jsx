// src/components/posts/MyPostContainer.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import usePost from "../../hooks/usePost";
import useAuth from "../../hooks/useAuth";
import useDepartment from "../../hooks/useDepartment";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";

const MyPostContainer = () => {
  const { userPosts, loading, error, fetchUserPosts, deletePost } = usePost();
  const { user, logout } = useAuth();
  const { departments, fetchDepartments } = useDepartment();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (user) {
      console.log('Fetching user posts...');
      fetchUserPosts();
      fetchDepartments();
    }
  }, [user, fetchUserPosts, fetchDepartments]);

  // Add a listener for navigation events
  useEffect(() => {
    const handleNavigation = () => {
      if (user) {
        console.log('Navigation detected, refreshing user posts...');
        fetchUserPosts();
      }
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleNavigation);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [user, fetchUserPosts]);

  // Add effect to log when userPosts changes
  useEffect(() => {
    console.log('User posts updated:', userPosts);
  }, [userPosts]);

  const handleCreatePost = () => {
    navigate("/posts/create");
  };

  const handleEdit = (postId) => {
    // Check if user is authenticated
    if (!user) {
      setErrorMessage("Please log in to edit posts");
      navigate("/login");
      return;
    }

    // Check if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Your session has expired. Please log in again.");
      logout();
      navigate("/login");
      return;
    }

    // Verify the post belongs to the current user
    const post = userPosts.find(p => p.postid === postId);
    if (!post) {
      setErrorMessage("Post not found");
      return;
    }

    // Navigate to edit page with correct route
    navigate(`/posts/${postId}/edit`, { state: { post } });
  };

  const confirmDelete = (postId) => {
    if (!user) {
      setErrorMessage("Please log in to delete posts");
      navigate("/login");
      return;
    }
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!postToDelete || !user) return;

    setLoadingDelete(true);
    setErrorMessage(null);
    
    try {
      const success = await deletePost(postToDelete);
      if (success) {
        setShowDeleteModal(false);
        setPostToDelete(null);
        // Refresh the posts list
        fetchUserPosts();
      }
    } catch (err) {
      if (err.message?.includes("session has expired") || err.message?.includes("Please log in")) {
        setErrorMessage("Your session has expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        setErrorMessage(err.message || "Failed to delete post");
      }
    } finally {
      setLoadingDelete(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  const posts = Array.isArray(userPosts) ? userPosts : [];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <Button onClick={handleCreatePost} className="bg-blue-500 text-white">
          Create New Post
        </Button>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{errorMessage}</p>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">
            You haven't created any posts yet.
          </p>
          <Button onClick={handleCreatePost} className="bg-blue-500 text-white">
            Create Your First Post
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {[...posts]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((post) => (
              <div key={post.postid} className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/posts/${post.postid}`}
                      className="text-xl font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {post.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(post.timestamp).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEdit(post.postid)}
                      className="bg-blue-500 text-white"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => confirmDelete(post.postid)}
                      className="bg-red-500 text-white"
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-gray-700 line-clamp-2">
                    {post.content ? post.content.substring(0, 150) : ''}
                    {post.content && post.content.length > 150 && "..."}
                  </p>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Post"
      >
        <div className="p-4">
          <p className="mb-4">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-300 text-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loadingDelete}
              className="bg-red-500 text-white"
            >
              {loadingDelete ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyPostContainer;
