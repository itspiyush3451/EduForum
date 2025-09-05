// src/components/posts/PostContainer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePost from "../../hooks/usePost";
import useAuth from "../../hooks/useAuth";
import useDepartment from "../../hooks/useDepartment";
import { useTheme } from "../../context/ThemeContext";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import Input from "../common/Input";
import Modal from "../common/Modal";
import { userService } from "../../services/userService";
import CreateCommentForm from "../comments/CreateCommentForm";
import { useComments } from "../../context/CommentContext";
import {
  FaComment,
  FaRegComment,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaEllipsisH,
  FaPlus,
  FaImage,
} from "react-icons/fa";

const PostContainer = () => {
  const { departmentPosts, loading, error, fetchAllPosts, createPost } =
    usePost();
  const { user } = useAuth();
  const { departments, fetchDepartments } = useDepartment();
  const { comments, fetchComments } = useComments();
  const { isDarkMode } = useTheme();
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
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostTags, setNewPostTags] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [liked, setLiked] = useState({});

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
      departmentPosts.forEach((post) => {
        if (post?.userid) uniqueUserIds.add(post.userid);
      });

      // Add comment authors
      if (comments) {
        Object.values(comments).forEach((postComments) => {
          if (Array.isArray(postComments)) {
            postComments.forEach((comment) => {
              if (comment?.userid) uniqueUserIds.add(comment.userid);
            });
          }
        });
      }

      const newUserNames = { ...userNames };

      for (const userId of uniqueUserIds) {
        if (!newUserNames[userId]) {
          try {
            const response = await userService.getUserById(userId);

            if (response.data && response.data.username) {
              newUserNames[userId] = response.data.username;
            } else if (response.data && response.data.user) {
              newUserNames[userId] = response.data.user.username;
            } else {
              newUserNames[userId] = "Anonymous";
            }
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            newUserNames[userId] = "Anonymous";
          }
        }
      }

      setUserNames(newUserNames);
    };

    fetchUserNames();
  }, [departmentPosts, comments]);

  const toggleComments = async (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    await fetchComments(postId);
  };

  const validateForm = () => {
    const errors = {};

    if (!newPostTitle.trim()) {
      errors.title = "Title is required";
    }

    if (!newPostContent.trim()) {
      errors.content = "Content is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const processedTags = newPostTags
      ? newPostTags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];

    const departmentId = user?.departmentid;

    if (!departmentId) {
      console.error("No department ID found in user profile");
      setFormErrors((prev) => ({
        ...prev,
        department:
          "Your account is not associated with any department. Please contact your administrator.",
      }));
      setSubmitting(false);
      return;
    }

    const postData = {
      title: newPostTitle,
      content: newPostContent,
      tags: processedTags,
      departmentid: Number(departmentId),
    };

    try {
      await createPost(postData);
      setSubmitting(false);
      setIsComposing(false);
      resetForm();
      await fetchAllPosts();
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
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostTags("");
    setFormErrors({});
  };

  const toggleLike = (postId) => {
    setLiked((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleEditPost = (post) => {
    // Implement edit functionality
    console.log("Edit post:", post);
  };

  const handleDeletePost = (postId) => {
    // Implement delete functionality
    console.log("Delete post:", postId);
  };

  const handleEditComment = (postId, commentId) => {
    // Implement edit comment functionality
    console.log("Edit comment:", postId, commentId);
  };

  const handleDeleteComment = (postId, commentId) => {
    // Implement delete comment functionality
    console.log("Delete comment:", postId, commentId);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Spinner size="lg" />
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Loading posts...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`px-4 py-3 rounded-lg border ${
          isDarkMode
            ? "bg-red-900/20 border-red-800 text-red-400"
            : "bg-red-100 border-red-400 text-red-700"
        }`}
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button
          onClick={() => fetchAllPosts()}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Twitter-style Compose Box */}
      <div
        className={`border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <div className="p-4">
          {!isComposing ? (
            <div
              onClick={() => setIsComposing(true)}
              className="flex items-center space-x-4 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user?.username?.[0]?.toUpperCase() || "Y"}
              </div>
              <div className="flex-grow">
                <div
                  className={`p-3 rounded-full transition cursor-pointer ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  What&apos;s on your mind?
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user?.username?.[0]?.toUpperCase() || "Y"}
                </div>
                <div className="flex-grow space-y-3">
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Add a title"
                    className={`w-full bg-transparent border-b p-2 focus:outline-none focus:border-blue-500 ${
                      isDarkMode
                        ? "border-gray-700 text-white placeholder-gray-400"
                        : "border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm">{formErrors.title}</p>
                  )}

                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="What's happening?"
                    className={`w-full bg-transparent border-none p-2 focus:outline-none resize-none ${
                      isDarkMode
                        ? "text-white placeholder-gray-400"
                        : "text-gray-900 placeholder-gray-500"
                    }`}
                    rows={3}
                  />
                  {formErrors.content && (
                    <p className="text-red-500 text-sm">{formErrors.content}</p>
                  )}

                  <input
                    type="text"
                    value={newPostTags}
                    onChange={(e) => setNewPostTags(e.target.value)}
                    placeholder="Add tags (comma-separated)"
                    className={`w-full bg-transparent border-b p-2 focus:outline-none focus:border-blue-500 ${
                      isDarkMode
                        ? "border-gray-700 text-white placeholder-gray-400"
                        : "border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex space-x-2 text-blue-500">
                  <button
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition ${
                      isDarkMode ? "hover:bg-blue-900/20" : "hover:bg-blue-100"
                    }`}
                  >
                    <FaImage />
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setIsComposing(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleCreatePost}
                    disabled={
                      submitting ||
                      !newPostTitle.trim() ||
                      !newPostContent.trim()
                    }
                    className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full transition ${
                      submitting ||
                      !newPostTitle.trim() ||
                      !newPostContent.trim()
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-lg"
                    }`}
                  >
                    {submitting ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="divide-y divide-gray-300 dark:divide-gray-700">
        {departmentPosts.map((post) => (
          <div
            key={post.postid}
            className={`p-4 transition-colors ${
              isDarkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
            }`}
          >
            {/* Post Header */}
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white !text-white font-medium">
                    {userNames[post.userid]?.[0]?.toUpperCase() || "A"}
                  </span>
                </div>
              </div>

              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span
                      className={`font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {userNames[post.userid] || "Anonymous"}
                    </span>
                    <span
                      className={`ml-2 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      @
                      {userNames[post.userid]
                        ?.toLowerCase()
                        .replace(/\s/g, "") || "anonymous"}
                    </span>
                    <span
                      className={`mx-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      ·
                    </span>
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {new Date(post.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="relative group">
                    <button
                      className={`p-2 rounded-full ${
                        isDarkMode
                          ? "text-gray-400 hover:bg-gray-700"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <FaEllipsisH size={14} />
                    </button>

                    {user?.userid === post.userid && (
                      <div
                        className={`absolute right-0 mt-1 w-48 rounded-lg shadow-lg border hidden group-hover:block z-10 ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        <button
                          onClick={() => handleEditPost(post)}
                          className={`w-full text-left px-4 py-2 ${
                            isDarkMode
                              ? "hover:bg-gray-700 text-gray-300"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          Edit post
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.postid)}
                          className={`w-full text-left px-4 py-2 text-red-500 ${
                            isDarkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          Delete post
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="mt-1">
                  <h3
                    className={`font-semibold text-lg ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {post.title}
                  </h3>
                  <p
                    className={`mt-1 whitespace-pre-wrap ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {post.content}
                  </p>
                </div>

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-blue-500 hover:underline text-sm cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="mt-3 flex justify-between max-w-md">
                  <button
                    onClick={() => toggleComments(post.postid)}
                    className={`flex items-center hover:text-blue-500 group ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full mr-1 transition-colors ${
                        isDarkMode
                          ? "group-hover:bg-blue-900/20"
                          : "group-hover:bg-blue-100"
                      }`}
                    >
                      {expandedComments[post.postid] ? (
                        <FaComment className="text-blue-500" size={16} />
                      ) : (
                        <FaRegComment size={16} />
                      )}
                    </div>
                    <span>{comments[post.postid]?.length || 0}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments[post.postid] && (
                  <div
                    className={`mt-4 pl-3 border-l-2 ${
                      isDarkMode ? "border-gray-700" : "border-gray-300"
                    }`}
                  >
                    {/* Comment Form */}
                    <div className="mb-4">
                      <CreateCommentForm
                        postId={post.postid}
                        departmentId={post.departmentid}
                      />
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments[post.postid]?.length > 0 ? (
                        comments[post.postid].map((comment) => {
                          if (!comment) return null;

                          const commentUser =
                            userNames[comment.userid] || "Anonymous";
                          const userInitial =
                            commentUser[0]?.toUpperCase() || "A";

                          return (
                            <div key={comment.commentid} className="flex">
                              <div className="flex-shrink-0 mr-3">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {userInitial}
                                  </span>
                                </div>
                              </div>

                              <div className="flex-grow">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      {commentUser}
                                    </span>
                                    <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs">
                                      {new Date(
                                        comment.timestamp
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </div>

                                  {user?.userid === comment.userid && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() =>
                                          handleEditComment(
                                            post.postid,
                                            comment.commentid
                                          )
                                        }
                                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 mr-2"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteComment(
                                            post.postid,
                                            comment.commentid
                                          )
                                        }
                                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">
                                  {comment.content || ""}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                          <FaRegComment className="mx-auto text-xl mb-2" />
                          <p className="text-sm">
                            No comments yet. Be the first to comment!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {departmentPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
            <FaRegComment className="text-4xl mb-3" />
            <p className="text-xl font-medium">No posts yet</p>
            <p className="mt-1">Be the first to create a post!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostContainer;
