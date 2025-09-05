import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotice } from "../../context/NoticeContext";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import {
  FaArrowLeft,
  FaSpinner,
  FaFileAlt,
  FaTimes,
  FaExclamationCircle,
  FaUpload,
  FaSave,
} from "react-icons/fa";

const CreateEditNoticeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isTeacher } = useAuth();
  const { isDarkMode } = useTheme();
  const { getNoticeById, createNotice, updateNotice, loading } = useNotice();

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
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png",
      ];

      if (!allowedTypes.includes(file.type)) {
        setFileError(
          "Invalid file type. Allowed types: PDF, DOC, DOCX, TXT, JPG, PNG"
        );
        return;
      }

      setFormData({ ...formData, file });
      if (file.type.startsWith("image/")) {
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
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("important", formData.important);
      formDataToSend.append("published", formData.published);
      if (formData.file) {
        formDataToSend.append("file", formData.file);
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
      <div
        className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                isDarkMode ? "border-blue-400" : "border-blue-600"
              }`}
            ></div>
            <p
              className={`mt-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className={`inline-flex items-center text-sm font-medium transition-all duration-200 hover:scale-105 ${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-800"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            } px-3 py-2 rounded-lg`}
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Notices
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {isEditing ? "Edit Notice" : "Create New Notice"}
          </h1>
          <p
            className={`mt-2 text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {isEditing
              ? "Update your notice information"
              : "Share important information with students"}
          </p>
        </div>

        {/* Form Card */}
        <div
          className={`rounded-xl shadow-sm overflow-hidden border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div>
                <label
                  htmlFor="title"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Notice Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="Enter a clear and descriptive title"
                />
                {validationErrors.title && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <FaExclamationCircle className="mr-1 h-4 w-4" />
                    {validationErrors.title}
                  </p>
                )}
              </div>

              {/* Content Field */}
              <div>
                <label
                  htmlFor="content"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Notice Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={8}
                  value={formData.content}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="Write the detailed content of your notice here..."
                />
                {validationErrors.content && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <FaExclamationCircle className="mr-1 h-4 w-4" />
                    {validationErrors.content}
                  </p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  File Attachment{" "}
                  <span className="text-gray-500">(Optional)</span>
                </label>
                <div
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
                    isDarkMode
                      ? "border-gray-600 hover:border-blue-500 bg-gray-700/50"
                      : "border-gray-300 hover:border-blue-400 bg-gray-50"
                  }`}
                >
                  <div className="space-y-2 text-center">
                    {!formData.file ? (
                      <>
                        <FaUpload
                          className={`mx-auto h-12 w-12 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                        <div
                          className={`flex text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <label
                            htmlFor="file-upload"
                            className={`relative cursor-pointer rounded-md font-medium transition-colors ${
                              isDarkMode
                                ? "text-blue-400 hover:text-blue-300"
                                : "text-blue-600 hover:text-blue-500"
                            } focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500`}
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          PDF, DOC, DOCX, TXT, JPG, PNG up to 5MB
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <FaFileAlt
                          className={`h-8 w-8 ${
                            isDarkMode ? "text-blue-400" : "text-blue-500"
                          }`}
                        />
                        <div className="flex-1">
                          <span
                            className={`text-sm font-medium block ${
                              isDarkMode ? "text-gray-100" : "text-gray-900"
                            }`}
                          >
                            {formData.file.name}
                          </span>
                          <span
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className={`p-1 rounded-full transition-colors ${
                            isDarkMode
                              ? "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              : "text-red-500 hover:text-red-700 hover:bg-red-50"
                          }`}
                        >
                          <FaTimes className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {fileError && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <FaExclamationCircle className="mr-1 h-4 w-4" />
                    {fileError}
                  </p>
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
                    <label
                      htmlFor="important"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
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
                    <label
                      htmlFor="published"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Publish immediately
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleBack}
                  className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isDarkMode
                      ? "text-gray-300 bg-gray-700 hover:bg-gray-600 hover:text-white focus:ring-gray-500"
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 focus:ring-gray-400"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isSubmitting ? "cursor-not-allowed opacity-50" : ""
                  } ${
                    isDarkMode
                      ? "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                      : "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <FaSpinner className="animate-spin h-4 w-4" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <FaSave className="h-4 w-4" />
                      <span>Save Notice</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {validationErrors.submit && (
                <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                  <div className="flex">
                    <FaExclamationCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                        Error
                      </h3>
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
