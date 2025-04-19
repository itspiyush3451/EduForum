import React, { useState } from "react";
import PropTypes from "prop-types";
import { useComments } from "../../context/CommentContext";
import Button from "../common/Button";
import { FaPaperPlane, FaUser } from "react-icons/fa";

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

  const handleKeyDown = (e) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (content.trim()) {
        handleSubmit(e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row md:items-start gap-3">
        <div className="flex-shrink-0 hidden md:block">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <FaUser />
          </div>
        </div>
        <div className="flex-grow">
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
            <textarea
              id="comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none resize-none min-h-24 transition-colors duration-200"
              placeholder="Share your thoughts..."
              rows={3}
              disabled={isSubmitting}
            />
            
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span className="hidden sm:inline">Press </span>
                <kbd className="px-1 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500 mx-1">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500 mx-1">Enter</kbd>
                <span className="hidden sm:inline"> to submit</span>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting || !content.trim()}
                className={`bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                  (!content.trim() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-sm" />
                    <span className="hidden sm:inline">Post Comment</span>
                    <span className="sm:hidden">Post</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800/30">
              <p className="font-medium">Error posting comment:</p>
              <p>{error}</p>
            </div>
          )}
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