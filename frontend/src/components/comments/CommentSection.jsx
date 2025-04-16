import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useComments } from "../../context/CommentContext";
import useAuth from "../../hooks/useAuth";
import CreateCommentForm from "./CreateCommentForm";
import CommentItem from "./CommentItem";
import Spinner from "../common/Spinner";

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
      <div className="my-4 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        Error loading comments: {error}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">
        Comments ({comments.length})
      </h3>

      {/* Comment creation form */}
      {currentUser && (
        <div className="mb-6">
          <CreateCommentForm postId={postId} departmentId={departmentId} />
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
            />
          ))
        ) : (
          <p className="text-gray-500 italic">
            No comments yet. Be the first to comment!
          </p>
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
