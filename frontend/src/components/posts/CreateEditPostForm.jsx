import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import usePost from "../../hooks/usePost";
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
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const isEditMode = Boolean(postId);

  useEffect(() => {
    if (isEditMode) {
      const loadPost = async () => {
        try {
          const postData = location.state?.post || await fetchPostById(postId);
          
          if (!postData) {
            throw new Error("Post not found");
          }

          const postContent = postData.content || "";
          
          setFormData({
            title: postData.title || "",
            content: postContent,
            tags: Array.isArray(postData.tags) ? postData.tags.join(", ") : "",
            departmentId: postData.departmentid || postData.department || "",
          });
          
          // Set initial counts
          setCharCount(postContent.length);
          setWordCount(postContent.trim() ? postContent.trim().split(/\s+/).length : 0);
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
        
        // Set initial counts for draft
        setCharCount(draft.content.length);
        setWordCount(draft.content.trim() ? draft.content.trim().split(/\s+/).length : 0);
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

    // Update word and character count for content
    if (name === "content") {
      setCharCount(value.length);
      setWordCount(value.trim() ? value.trim().split(/\s+/).length : 0);
    }

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
        // In edit mode, send all necessary fields
        const postData = {
          content: formData.content.trim(),
          title: formData.title.trim(),
          departmentid: Number(formData.departmentId)
        };
        
        const updatedPost = await updatePost(postId, postData);
        
        if (updatedPost) {
          localStorage.removeItem('postDraft');
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

        await createPost(postData);
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
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {isEditMode ? "Edit Post Content" : "Create New Post"}
      </h1>

      {error && (
        <div className="bg-error-300 dark:bg-error-500/20 border border-error-500 text-error-500 px-4 py-3 rounded-lg mb-6 animate-fadeIn">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {formErrors.submit && (
        <div className="bg-error-300 dark:bg-error-500/20 border border-error-500 text-error-500 px-4 py-3 rounded-lg mb-6 animate-fadeIn">
          <p className="font-medium">{formErrors.submit}</p>
        </div>
      )}

      {lastSaved && (
        <div className="bg-info-300/30 dark:bg-info-500/20 text-info-500 px-4 py-2 rounded-lg mb-4 text-sm flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span>Draft auto-saved at {lastSaved.toLocaleTimeString()}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isEditMode && (
          <div className="mb-6">
            <Input
              label="Title"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              error={formErrors.title}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              labelClassName="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
            />
            {formData.title && (
              <p className="mt-1 text-right text-sm text-gray-500 dark:text-gray-400">
                {formData.title.length}/100
              </p>
            )}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="content">
            Content
          </label>
          <div className="relative">
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content here..."
              className={`w-full px-4 py-3 text-gray-700 dark:text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ease-in-out min-h-[200px] bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${
                formErrors.content ? "border-error-500 focus:border-error-500 focus:ring-error-500" : "border-gray-300 dark:border-gray-600"
              }`}
              rows="10"
              required
            />
            <div className="absolute bottom-3 right-3 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-2 py-1 rounded-md">
              {charCount}/5000
            </div>
          </div>
          {formErrors.content && (
            <p className="mt-1 text-error-500 text-xs font-medium">{formErrors.content}</p>
          )}
          <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Words: {wordCount}</span>
            <span>Characters: {charCount}</span>
          </div>
        </div>

        {!isEditMode && (
          <div className="mb-6">
            <Input
              label="Tags (comma-separated)"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags, separated by commas"
              error={formErrors.tags}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              labelClassName="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
            />
            {formErrors.tags && (
              <p className="mt-1 text-error-500 text-xs font-medium">{formErrors.tags}</p>
            )}
            {formData.tags && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.split(',').map((tag, index) => (
                  tag.trim() && (
                    <span 
                      key={index} 
                      className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded"
                    >
                      {tag.trim()}
                    </span>
                  )
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            onClick={() => navigate("/posts/my-posts")}
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 ease-in-out"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
            disabled={submitting}
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
            ) : (
              isEditMode ? "Update Content" : "Create Post"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditPostForm;