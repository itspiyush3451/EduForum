// src/components/posts/PostDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePost from "../../hooks/usePost";
import useAuth from "../../hooks/useAuth";
import CommentSection from "../comments/CommentSection";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Spinner from "../common/Spinner";

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { fetchPostById, currentPost, loading, error, deletePost } = usePost();
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPostById(postId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleBack = () => {
    navigate("/posts");
  };

  const handleEdit = () => {
    navigate(`/posts/edit/${postId}`);
  };

  const confirmDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    setLoadingAction(true);
    const success = await deletePost(postId);
    setLoadingAction(false);
    if (success) {
      setDeleteDialogOpen(false);
      navigate("/posts");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="p-0 mr-4">
            <span>←</span>
          </Button>
          <Spinner />
        </div>
        <div className="w-full border rounded p-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-48 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={handleBack} className="p-0 mr-4">
            <span>←</span>
          </Button>
          <h2 className="text-lg font-semibold text-red-700">Error</h2>
        </div>
        <div className="flex items-start">
          <span className="text-red-600 mr-2">⚠️</span>
          <div>
            <p className="text-red-600">{error}</p>
            <p className="text-red-600 mt-2">
              The post could not be found or you don't have permission to view
              it.
            </p>
            <Button onClick={handleBack} className="mt-4">
              Back to Posts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="p-4 border border-amber-300 bg-amber-50 rounded-md">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={handleBack} className="p-0 mr-4">
            <span>←</span>
          </Button>
          <h2 className="text-lg font-semibold text-amber-700">
            Post Not Found
          </h2>
        </div>
        <p className="text-amber-600">
          The requested post could not be found. It may have been deleted or you
          may not have permission to view it.
        </p>
        <Button onClick={handleBack} className="mt-4">
          Back to Posts
        </Button>
      </div>
    );
  }

  const isAuthor = user && currentPost.author._id === user._id;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={handleBack} className="p-0 mr-4">
          <span>←</span>
        </Button>
        <h2 className="text-2xl font-bold">Post Details</h2>
      </div>

      <div className="w-full border rounded-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold">{currentPost.title}</h3>
              <p className="text-gray-500 mt-2">
                Posted by {currentPost.author.name} on{" "}
                {formatDate(currentPost.createdAt)}
                {currentPost.updatedAt !== currentPost.createdAt &&
                  ` (Updated on ${formatDate(currentPost.updatedAt)})`}
              </p>
            </div>
            {isAuthor && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleEdit}>
                  Edit
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="prose max-w-none">
            {currentPost.content.split("\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags Section */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {currentPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-sm bg-gray-100 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comment Section */}
          <div className="mt-8 border-t pt-6">
            <CommentSection postId={postId} />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <Modal
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          title="Are you sure?"
        >
          <div>
            <p>
              This will permanently delete the post "{currentPost?.title}". This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={loadingAction}
              >
                {loadingAction ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PostDetails;
