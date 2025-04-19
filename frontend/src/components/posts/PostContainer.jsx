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
import { FaComment, FaRegComment, FaHeart, FaRegHeart, FaShare, FaEllipsisH, FaPlus, FaImage } from "react-icons/fa";

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
            const response = await userService.getUserById(userId);
            
            if (response.data && response.data.username) {
              newUserNames[userId] = response.data.username;
            } else if (response.data && response.data.user) {
              newUserNames[userId] = response.data.user.username;
            } else {
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
        department: "Your account is not associated with any department. Please contact your administrator.",
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
    setLiked(prev => ({
      ...prev,
      [postId]: !prev[postId]
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
        <p className="text-gray-600 dark:text-gray-300">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg" role="alert">
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
      <div className="border-b border-gray-300 dark:border-gray-700">
        <div className="p-4">
          {!isComposing ? (
            <div 
              onClick={() => setIsComposing(true)}
              className="flex items-center space-x-4 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user?.username?.[0]?.toUpperCase() || 'Y'}
              </div>
              <div className="flex-grow">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                  What's on your mind?
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user?.username?.[0]?.toUpperCase() || 'Y'}
                </div>
                <div className="flex-grow space-y-3">
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Add a title"
                    className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm">{formErrors.title}</p>
                  )}
                  
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="What's happening?"
                    className="w-full bg-transparent border-none p-2 focus:outline-none resize-none text-gray-900 dark:text-white placeholder-gray-500"
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
                    className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="flex space-x-2 text-blue-500">
                  <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition">
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
                    disabled={submitting || !newPostTitle.trim() || !newPostContent.trim()}
                    className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full transition ${
                      submitting || !newPostTitle.trim() || !newPostContent.trim()
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
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            {/* Post Header */}
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {userNames[post.userid]?.[0]?.toUpperCase() || 'A'}
                  </span>
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {userNames[post.userid] || 'Anonymous'}
                    </span>
                    <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
                      @{userNames[post.userid]?.toLowerCase().replace(/\s/g, '') || 'anonymous'}
                    </span>
                    <span className="mx-1 text-gray-500 dark:text-gray-400">·</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(post.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                      <FaEllipsisH size={14} />
                    </button>
                    
                    {user?.userid === post.userid && (
                      <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 hidden group-hover:block z-10">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          Edit post
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.postid)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                        >
                          Delete post
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Post Content */}
                <div className="mt-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap">
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
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500 group"
                  >
                    <div className="p-2 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 rounded-full mr-1 transition-colors">
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
                  <div className="mt-4 pl-3 border-l-2 border-gray-300 dark:border-gray-700">
                    {/* Comment Form */}
                    <div className="mb-4">
                      <CreateCommentForm postId={post.postid} departmentId={post.departmentid} />
                    </div>
                    
                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments[post.postid]?.length > 0 ? (
                        comments[post.postid].map((comment) => {
                          if (!comment) return null;
                          
                          const commentUser = userNames[comment.userid] || 'Anonymous';
                          const userInitial = commentUser[0]?.toUpperCase() || 'A';
                          
                          return (
                            <div
                              key={comment.commentid}
                              className="flex group"
                            >
                              <div className="flex-shrink-0 mr-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center">
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
                                      {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric"
                                      }) : 'Just now'}
                                    </span>
                                  </div>
                                  
                                  {user?.userid === comment.userid && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => handleEditComment(post.postid, comment.commentid)}
                                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 mr-2"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteComment(post.postid, comment.commentid)}
                                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">
                                  {comment.content || ''}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                          <FaRegComment className="mx-auto text-xl mb-2" />
                          <p className="text-sm">No comments yet. Be the first to comment!</p>
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