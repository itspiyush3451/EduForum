// src/components/posts/EditPostModal.jsx
import React, { useState, useEffect } from "react";
import usePost from "../../hooks/usePost";
import useDepartment from "../../hooks/useDepartment";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import PropTypes from "prop-types";

const EditPostModal = ({ postId, isOpen, onClose }) => {
  const { fetchPostById, updatePost, loading, error } = usePost();
  const { departments, fetchDepartments } = useDepartment();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    departmentId: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && postId) {
      fetchDepartments();

      const loadPost = async () => {
        const post = await fetchPostById(postId);
        if (post) {
          setFormData({
            title: post.title,
            content: post.content,
            tags: post.tags.join(", "),
            departmentId: post.department,
          });
        }
      };

      loadPost();
    }
  }, [isOpen, postId, fetchPostById, fetchDepartments]);

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }

    if (!formData.departmentId) {
      errors.departmentId = "Department is required";
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

    // Clear the specific error when the user starts typing
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

    // Process tags (convert from comma-separated string to array)
    const processedTags = formData.tags
      ? formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];

    const postData = {
      title: formData.title,
      content: formData.content,
      tags: processedTags,
      department: formData.departmentId,
    };

    try {
      await updatePost(postId, postData);
      onClose(true); // Close modal and indicate successful update
    } catch (err) {
      console.error("Failed to update post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      content: "",
      tags: "",
      departmentId: "",
    });
    setFormErrors({});
    onClose(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Post">
      <div className="p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Title"
              id="modal-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              error={formErrors.title}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="modal-content"
            >
              Content
            </label>
            <textarea
              id="modal-content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content here..."
              className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline ${
                formErrors.content ? "border-red-500" : "border-gray-300"
              }`}
              rows="6"
              required
            />
            {formErrors.content && (
              <p className="text-red-500 text-xs italic">
                {formErrors.content}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="modal-departmentId"
            >
              Department
            </label>
            <select
              id="modal-departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline ${
                formErrors.departmentId ? "border-red-500" : "border-gray-300"
              }`}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {formErrors.departmentId && (
              <p className="text-red-500 text-xs italic">
                {formErrors.departmentId}
              </p>
            )}
          </div>

          <div className="mb-6">
            <Input
              label="Tags (comma-separated)"
              id="modal-tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. programming, react, javascript"
              error={formErrors.tags}
            />
            <p className="text-gray-500 text-xs mt-1">
              Separate tags with commas (e.g. "programming, react, javascript")
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              onClick={handleClose}
              className="bg-gray-300 text-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || loading}
              className="bg-blue-500 text-white"
            >
              {submitting ? "Saving..." : "Update Post"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
EditPostModal.propTypes = {
  postId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditPostModal;
