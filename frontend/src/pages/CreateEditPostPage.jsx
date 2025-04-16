import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import CreateEditPostForm from "../components/posts/CreateEditPostForm";
import useAuth from "../hooks/useAuth";
import usePost from "../hooks/usePost";
import { postService } from "../services/postService";
import Spinner from "../components/common/Spinner";
import Button from "../components/common/Button";

const CreateEditPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { fetchPostById } = usePost();
  const [post, setPost] = useState(location.state?.post || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEditMode = !!postId;

  useEffect(() => {
    // If we're in edit mode and don't have post data from navigation state
    if (isEditMode && !post) {
      setLoading(true);
      fetchPostById(postId)
        .then((postData) => {
          if (!postData) {
            throw new Error("Post not found");
          }
          setPost(postData);
          // Check if user has permission to edit this post
          if (postData.userid !== user.id && user.role !== "ADMIN") {
            setError("You do not have permission to edit this post");
            navigate("/posts/my-posts");
          }
        })
        .catch((err) => {
          console.error("Error fetching post:", err);
          setError(err.message || "Failed to fetch post data");
          // Navigate back to my posts on error
          navigate("/posts/my-posts");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [postId, user, fetchPostById, isEditMode, post, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      if (isEditMode) {
        const updatedPost = await postService.updatePost(postId, formData);
        navigate(`/posts/${postId}`);
      } else {
        const newPost = await postService.createPost(formData);
        navigate(`/posts/${newPost.postid}`);
      }
    } catch (err) {
      console.error("Error saving post:", err);
      setError(err.message || "Failed to save post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/posts/my-posts");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
        <Button
          onClick={() => navigate("/posts/my-posts")}
          className="mt-4 bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          Go Back to My Posts
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Post" : "Create New Post"}
      </h1>

      <CreateEditPostForm
        initialData={post}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={loading}
      />
    </div>
  );
};

export default CreateEditPostPage;
