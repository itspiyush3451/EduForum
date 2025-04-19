import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useComments } from "../../context/CommentContext";
import useAuth from "../../hooks/useAuth";
import CreateCommentForm from "./CreateCommentForm";
import CommentItem from "./CommentItem";
import Spinner from "../common/Spinner";
import { FaComments } from "react-icons/fa";

const CommentSection = ({ postId, departmentId = null }) => {
  const {
    comments,
    loading,
    error,
    fetchComments,
    clearComments,
    currentPostId,
  } = useComments();

  const { currentUser } = useAuth();

  // Fetch comments when the component mounts or when the postId changes
  useEffect(() => {
    if (postId) {
      fetchComments(postId);
    }

    // Clear comments when unmounting
    return () => clearComments();
  }, [postId, fetchComments, clearComments]);

  if (loading && (!comments.length || currentPostId !== postId)) {
    return (
      <div className="my-6 flex justify-center">
        <Spinner className="text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/30 text-red-700 dark:text-red-400 rounded-lg">
        <p className="font-medium">Error loading comments</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-gray-50 dark:bg-gray-900 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-900 dark:text-gray-100">
        <FaComments className="mr-2 text-blue-500" />
        Discussion ({comments.length})
      </h3>

      {/* Comment creation form */}
      {currentUser ? (
        <div className="mb-8">
          <CreateCommentForm postId={postId} departmentId={departmentId} />
        </div>
      ) : (
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 text-blue-800 dark:text-blue-300 rounded-lg">
          <p>Please sign in to join the discussion.</p>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-5">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 italic">
              No comments yet. Be the first to join the discussion!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
  departmentId: PropTypes.string,
};

export default CommentSection;