// src/components/posts/CreateEditPostForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import usePost from "../../hooks/usePost";
import useDepartment from "../../hooks/useDepartment";
import useAuth from "../../hooks/useAuth";
import Button from "../common/Button";
import Input from "../common/Input";
import Spinner from "../common/Spinner";

const CreateEditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchPostById, createPost, updatePost, loading, error } = usePost();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    departmentId: user?.departmentid || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);

  const isEditMode = Boolean(postId);

  useEffect(() => {
    if (isEditMode) {
      const loadPost = async () => {
        try {
          const postData = location.state?.post || await fetchPostById(postId);
          
          if (!postData) {
            throw new Error("Post not found");
          }

          setFormData({
            title: postData.title || "",
            content: postData.content || "",
            tags: Array.isArray(postData.tags) ? postData.tags.join(", ") : "",
            departmentId: postData.departmentid || postData.department || "",
          });
        } catch (err) {
          console.error("Error loading post:", err);
          navigate("/posts/my-posts");
        }
      };

      loadPost();
    }
  }, [isEditMode, postId, fetchPostById, location.state, navigate]);

  useEffect(() => {
    const savedDraft = localStorage.getItem('postDraft');
    if (savedDraft && !isEditMode) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [isEditMode]);

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim() && !isEditMode) {
      errors.title = "Title is required";
    } else if (formData.title.length < 3 && !isEditMode) {
      errors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 100 && !isEditMode) {
      errors.title = "Title cannot exceed 100 characters";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    } else if (formData.content.length < 10) {
      errors.content = "Content must be at least 10 characters";
    } else if (formData.content.length > 5000) {
      errors.content = "Content cannot exceed 5000 characters";
    }

    if (formData.tags && !isEditMode) {
      const tagArray = formData.tags.split(',').map(tag => tag.trim());
      const invalidTags = tagArray.filter(tag => tag.length > 20);
      if (invalidTags.length > 0) {
        errors.tags = "Tags cannot exceed 20 characters";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      if (formData.content.length > 50) {
        const draftData = {
          ...formData,
          [name]: value,
          lastModified: new Date().toISOString()
        };
        localStorage.setItem('postDraft', JSON.stringify(draftData));
        setLastSaved(new Date());
      }
    }, 2000);

    setAutoSaveTimer(timer);

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode) {
        console.log('Editing post with ID:', postId);
        console.log('Current form data:', formData);
        
        // In edit mode, send all necessary fields
        const postData = {
          content: formData.content.trim(),
          title: formData.title.trim(),
          departmentid: Number(formData.departmentId)
        };
        
        console.log('Sending update with data:', postData);
        const updatedPost = await updatePost(postId, postData);
        console.log('Received updated post:', updatedPost);
        
        if (updatedPost) {
          localStorage.removeItem('postDraft');
          // Use React Router's navigate instead of window.location
          navigate("/posts/my-posts", { replace: true });
        } else {
          throw new Error("Failed to update post");
        }
      } else {
        // In create mode, send all fields
        const processedTags = formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [];

        const postData = {
          title: formData.title.trim(),
          content: formData.content.trim(),
          tags: processedTags,
          departmentid: Number(formData.departmentId),
        };

        const newPost = await createPost(postData);
        localStorage.removeItem('postDraft');
        navigate("/posts/my-posts", { replace: true });
      }
    } catch (err) {
      console.error("Failed to save post:", err);
      setFormErrors(prev => ({
        ...prev,
        submit: err.message || "Failed to save post. Please try again."
      }));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Post Content" : "Create New Post"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {formErrors.submit && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{formErrors.submit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isEditMode && (
          <div className="mb-4">
            <Input
              label="Title"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              error={formErrors.title}
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content here..."
            className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline ${
              formErrors.content ? "border-red-500" : "border-gray-300"
            }`}
            rows="8"
            required
          />
          {formErrors.content && (
            <p className="text-red-500 text-xs italic">{formErrors.content}</p>
          )}
        </div>

        {!isEditMode && (
          <div className="mb-4">
            <Input
              label="Tags (comma-separated)"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags, separated by commas"
              error={formErrors.tags}
            />
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button
            type="button"
            onClick={() => navigate("/posts/my-posts")}
            className="bg-gray-500 text-white"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-500 text-white"
            disabled={submitting}
          >
            {submitting ? "Saving..." : isEditMode ? "Update Content" : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditPostForm;
