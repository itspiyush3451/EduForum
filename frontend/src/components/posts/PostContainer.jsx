// src/components/posts/PostContainer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePost from "../../hooks/usePost";
import useAuth from "../../hooks/useAuth";
import useDepartment from "../../hooks/useDepartment";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import Input from "../common/Input";
import Modal from "../common/Modal";
import { userService } from "../../services/userService";
import CreateCommentForm from "../comments/CreateCommentForm";
import { useComments } from "../../context/CommentContext";
import { FaComment, FaRegComment, FaRegCommentDots, FaPlus } from "react-icons/fa";

const PostContainer = () => {
  const { departmentPosts, loading, error, fetchAllPosts, createPost } = usePost();
  const { user } = useAuth();
  const { departments, fetchDepartments } = useDepartment();
  const { comments, fetchComments } = useComments();
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    departmentId: user?.departmentid || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAllPosts();
    fetchDepartments();
  }, [fetchAllPosts, fetchDepartments]);

  // Fetch comments for all posts when the component mounts
  useEffect(() => {
    const fetchAllComments = async () => {
      if (departmentPosts?.length) {
        for (const post of departmentPosts) {
          await fetchComments(post.postid);
        }
      }
    };
    fetchAllComments();
  }, [departmentPosts, fetchComments]);

  // Fetch user names for posts and comments
  useEffect(() => {
    const fetchUserNames = async () => {
      if (!departmentPosts?.length) return;
      
      const uniqueUserIds = new Set();
      
      // Add post authors
      departmentPosts.forEach(post => {
        if (post?.userid) uniqueUserIds.add(post.userid);
      });
      
      // Add comment authors
      if (comments) {
        Object.values(comments).forEach(postComments => {
          if (Array.isArray(postComments)) {
            postComments.forEach(comment => {
              if (comment?.userid) uniqueUserIds.add(comment.userid);
            });
          }
        });
      }
      
      const newUserNames = { ...userNames };
      
      for (const userId of uniqueUserIds) {
        if (!newUserNames[userId]) {
          try {
            console.log(`Fetching user data for ID: ${userId}`);
            const response = await userService.getUserById(userId);
            console.log(`User data response for ${userId}:`, response);
            
            if (response.data && response.data.username) {
              newUserNames[userId] = response.data.username;
            } else if (response.data && response.data.user) {
              newUserNames[userId] = response.data.user.username;
            } else {
              console.warn(`No username found for user ${userId}`);
              newUserNames[userId] = 'Anonymous';
            }
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            newUserNames[userId] = 'Anonymous';
          }
        }
      }
      
      setUserNames(newUserNames);
    };

    fetchUserNames();
  }, [departmentPosts, comments]);

  const toggleComments = async (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    
    // Always fetch comments when expanding, and also fetch when collapsing to ensure we have the latest data
    await fetchComments(postId);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const processedTags = formData.tags
      ? formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];

    const departmentId = user?.departmentid;
    
    if (!departmentId) {
      console.error("No department ID found in user profile");
      setFormErrors((prev) => ({
        ...prev,
        department: "Your account is not associated with any department. Please contact your administrator.",
      }));
      setSubmitting(false);
      return;
    }

    const postData = {
      title: formData.title,
      content: formData.content,
      tags: processedTags,
      departmentid: Number(departmentId),
    };

    try {
      await createPost(postData);
      setSubmitting(false);
      setShowCreateModal(false);
      resetForm();
      await fetchAllPosts(); // Refresh the posts list
    } catch (error) {
      console.error("Error creating post:", error);
      setFormErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to create post. Please try again.",
      }));
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      tags: "",
      departmentId: user?.departmentid || "",
    });
    setFormErrors({});
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Spinner size="lg" />
        <p className="text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button 
          onClick={() => fetchAllPosts()} 
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Create Post Button */}
      <div className="mb-6 flex justify-end">
        <Button
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          className="flex items-center gap-2"
        >
          <FaPlus className="text-sm" />
          Create Post
        </Button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {departmentPosts.map((post) => (
          <div
            key={post.postid}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Post Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {userNames[post.userid]?.[0]?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {userNames[post.userid] || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(post.timestamp).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
                {user?.userid === post.userid && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPost(post)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeletePost(post.postid)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Post Content */}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {post.title}
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
              
              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleComments(post.postid)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {expandedComments[post.postid] ? (
                      <FaComment className="text-blue-600" />
                    ) : (
                      <FaRegComment />
                    )}
                    <span className="text-sm font-medium">
                      {comments[post.postid]?.length || 0} {comments[post.postid]?.length === 1 ? 'comment' : 'comments'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            {expandedComments[post.postid] && (
              <div className="border-t border-gray-200">
                {/* Comments List */}
                <div className="p-4 space-y-4">
                  {comments[post.postid]?.map((comment) => {
                    if (!comment) return null;
                    
                    const commentUser = userNames[comment.userid] || 'Anonymous';
                    const userInitial = commentUser[0]?.toUpperCase() || 'A';
                    
                    return (
                      <div
                        key={comment.commentid}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {userInitial}
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {commentUser}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  }) : 'Just now'}
                                </p>
                              </div>
                              {user?.userid === comment.userid && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditComment(post.postid, comment.commentid)}
                                    className="text-gray-500 hover:text-blue-600"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(post.postid, comment.commentid)}
                                    className="text-gray-500 hover:text-red-600"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                            <p className="mt-2 text-gray-700">{comment.content || ''}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {(!comments[post.postid] || comments[post.postid].length === 0) && (
                    <div className="text-center py-4 text-gray-500">
                      <FaRegComment className="mx-auto text-2xl mb-2" />
                      <p>No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>

                {/* Comment Form */}
                <div className="p-4 border-t border-gray-200">
                  <CreateCommentForm postId={post.postid} departmentId={post.departmentid} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title="Create New Post"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={formErrors.title}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
            {formErrors.content && (
              <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
            )}
          </div>
          <Input
            label="Tags (comma-separated)"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., question, help, discussion"
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseCreateModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PostContainer;
