import React, { useState } from "react";
import { useComments } from "../../context/CommentContext";
import Button from "../common/Button";
import PropTypes from "prop-types";
import { FaEdit, FaTrash, FaClock } from "react-icons/fa";

const CommentItem = ({ comment, currentUser }) => {
  const { editComment, removeComment } = useComments();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user is the comment author
  const isAuthor =
    currentUser &&
    (currentUser.id === comment.userId ||
      currentUser.username === comment.username);

  // Format the comment date
  const formattedDate = new Date(comment.createdAt).toLocaleString();
  
  // Calculate time difference for relative time
  const getRelativeTime = () => {
    const now = new Date();
    const commentDate = new Date(comment.createdAt);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formattedDate;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (editedContent.trim()) {
      try {
        await editComment(comment.id, editedContent);
        setIsEditing(false);
      } catch (error) {
        console.error("Error saving edited comment:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setIsDeleting(true);
      try {
        await removeComment(comment.id);
      } catch (error) {
        console.error("Error deleting comment:", error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="p-4 md:p-5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Comment header with author and date */}
      <div className="flex justify-between items-center mb-3 border-b pb-2 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            {comment.username ? comment.username.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {comment.username || "Anonymous"}
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FaClock className="mr-1 text-xs" />
          <span title={formattedDate}>{getRelativeTime()}</span>
        </div>
      </div>

      {/* Comment content */}
      {isEditing ? (
        <div className="mt-3">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors duration-200"
            rows={3}
          />

          <div className="mt-3 flex justify-end space-x-2">
            <Button onClick={handleCancelEdit} variant="outline" size="sm" className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} variant="primary" size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-2 text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
          {comment.content}
        </div>
      )}

      {/* Comment actions (edit/delete) */}
      {isAuthor && !isEditing && (
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={handleEdit}
            className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm transition-colors duration-200"
          >
            <FaEdit className="mr-1" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm transition-colors duration-200"
            disabled={isDeleting}
          >
            <FaTrash className="mr-1" />
            <span className="hidden sm:inline">{isDeleting ? "Deleting..." : "Delete"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userId: PropTypes.string,
    username: PropTypes.string,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
  }),
};

export default CommentItem;