import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotice } from "../../context/NoticeContext";
import { useAuth } from "../../hooks/useAuth";
import { FaArrowLeft, FaSpinner, FaDownload, FaFileAlt, FaImage, FaTimes, FaExclamationCircle } from "react-icons/fa";
import Button from "../common/Button";
import Input from "../common/Input";

const CreateEditNoticeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isTeacher, user } = useAuth();
  const { getNoticeById, createNotice, updateNotice, loading, error } = useNotice();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    important: false,
    published: true,
    file: null,
  });

  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const isEditing = !!id;

  useEffect(() => {
    if (!isTeacher) {
      navigate("/notices");
    }
  }, [isTeacher, navigate]);

  useEffect(() => {
    const fetchNotice = async () => {
      if (isEditing && id) {
        try {
          const notice = await getNoticeById(id);
          setFormData({
            title: notice.title || "",
            content: notice.content || "",
            important: notice.important || false,
            published: notice.published !== undefined ? notice.published : true,
          });
          if (notice.fileUrl) {
            setFilePreview(notice.fileUrl);
          }
        } catch (err) {
          console.error("Error fetching notice:", err);
          setValidationErrors({
            fetch: "Failed to load notice. Please try again.",
          });
        }
      }
    };

    fetchNotice();
  }, [id, isEditing, getNoticeById]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setFormTouched(true);

    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: null });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError(null);
    
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size must be less than 5MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setFileError("Invalid file type. Allowed types: PDF, DOC, DOCX, TXT, JPG, PNG");
        return;
      }

      setFormData({ ...formData, file });
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, file: null });
    setFilePreview(null);
    setFileError(null);
  };

  const handleDownloadFile = async () => {
    if (formData.file) {
      try {
        await downloadAttachment(formData.file);
      } catch (err) {
        setFileError("Failed to download file");
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.content.trim()) errors.content = "Content is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (fileError) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('important', formData.important);
      formDataToSend.append('published', formData.published);
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      if (isEditing) {
        await updateNotice(id, formDataToSend);
      } else {
        await createNotice(formDataToSend);
      }
      navigate("/notices");
    } catch (err) {
      console.error("Error saving notice:", err);
      setValidationErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/notices");
  };

  if (!isTeacher) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <FaSpinner className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Notices
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm transition-colors"
                  placeholder="Enter a descriptive title for your notice"
                />
                {validationErrors.title && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{validationErrors.title}</p>
                )}
              </div>

              {/* Content Field */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={8}
                  value={formData.content}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm transition-colors"
                  placeholder="Write the content of your notice here..."
                />
                {validationErrors.content && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{validationErrors.content}</p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Attachment
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <div className="space-y-2 text-center">
                    {!formData.file ? (
                      <>
                        <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, DOC, DOCX, TXT, JPG, PNG up to 5MB
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <FaFileAlt className="h-8 w-8 text-blue-500" />
                        <span className="text-sm text-gray-900 dark:text-gray-100">{formData.file.name}</span>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        >
                          <FaTimes className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {fileError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fileError}</p>
                )}
              </div>

              {/* Options */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center">
                    <input
                      id="important"
                      name="important"
                      type="checkbox"
                      checked={formData.important}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-colors"
                    />
                    <label htmlFor="important" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Mark as important
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="published"
                      name="published"
                      type="checkbox"
                      checked={formData.published}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-colors"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Publish immediately
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex justify-center items-center px-6 py-2.5 border border-red-500 dark:border-red-600 shadow-sm text-sm font-medium rounded-lg text-white bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 hover:border-red-600 dark:hover:border-red-700 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    'Save Notice'
                  )}
                </button>
              </div>

              {/* Error Message */}
              {validationErrors.submit && (
                <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                  <div className="flex">
                    <FaExclamationCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Error</h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        <p>{validationErrors.submit}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEditNoticeForm;
