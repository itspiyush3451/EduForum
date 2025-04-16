import React, { useState } from "react";
import { useComments } from "../../context/CommentContext";
import Button from "../common/Button";
import PropTypes from "prop-types";

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
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      {/* Comment header with author and date */}
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">{comment.username || "Anonymous"}</div>
        <div className="text-sm text-gray-500">{formattedDate}</div>
      </div>

      {/* Comment content */}
      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />

          <div className="mt-2 flex justify-end space-x-2">
            <Button onClick={handleCancelEdit} variant="outline" size="sm">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} variant="primary" size="sm">
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-1">{comment.content}</div>
      )}

      {/* Comment actions (edit/delete) */}
      {isAuthor && !isEditing && (
        <div className="mt-3 flex justify-end space-x-2">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
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
