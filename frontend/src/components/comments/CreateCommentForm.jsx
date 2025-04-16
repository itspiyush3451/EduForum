import React, { useState } from "react";
import PropTypes from "prop-types";
import { useComments } from "../../context/CommentContext";
import Button from "../common/Button";
import { FaPaperPlane } from "react-icons/fa";

const CreateCommentForm = ({ postId, departmentId = null }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { addComment, fetchComments } = useComments();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addComment(postId, content, departmentId);
      setContent(""); // Clear the form after successful submission
      // Refresh comments for this post
      await fetchComments(postId);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Error submitting comment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <FaPaperPlane className="text-gray-600" />
          </div>
        </div>
        <div className="flex-grow">
          <textarea
            id="comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Write your comment..."
            rows={2}
            disabled={isSubmitting}
          />
          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          <div className="mt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting || !content.trim()}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                "Posting..."
              ) : (
                <>
                  <FaPaperPlane className="text-sm" />
                  Post Comment
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

CreateCommentForm.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  departmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CreateCommentForm;
