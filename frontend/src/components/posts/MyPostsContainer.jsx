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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Posts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and view all your posts</p>
        </div>
        <button
          onClick={handleCreatePost}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span>Create New Post</span>
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6" role="alert">
          <p>{errorMessage}</p>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No Posts Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start sharing your thoughts and ideas with the community
          </p>
          <button
            onClick={handleCreatePost}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl mx-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span>Create Your First Post</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {[...posts]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((post) => (
              <div key={post.postid} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Link
                        to={`/posts/${post.postid}`}
                        className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {post.title}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                      <button
                        onClick={() => handleEdit(post.postid)}
                        className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => confirmDelete(post.postid)}
                        className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                      {post.content ? post.content.substring(0, 150) : ''}
                      {post.content && post.content.length > 150 && "..."}
                    </p>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
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
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-red-600 dark:text-red-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
            Delete Post
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loadingDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingDelete ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyPostContainer;
