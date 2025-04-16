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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md space-y-6">
      <div className="flex items-center mb-4">
        <button onClick={handleBack} className="text-blue-600 mr-2">
          <FaArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-semibold">
          {isEditing ? "Edit Notice" : "Create Notice"}
        </h2>
      </div>

      {(error || fileError) && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded flex items-center">
          <FaExclamationCircle className="h-5 w-5 mr-2" />
          <span>{error || fileError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded ${
              validationErrors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {validationErrors.title && (
            <p className="text-red-500 text-sm">{validationErrors.title}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded min-h-[150px] ${
              validationErrors.content ? "border-red-500" : "border-gray-300"
            }`}
          />
          {validationErrors.content && (
            <p className="text-red-500 text-sm">{validationErrors.content}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="file">
            Attachment (Optional)
          </label>
          <div className="space-y-2">
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              className="w-full border px-3 py-2 rounded border-gray-300"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            
            {(filePreview || formData.file) && (
              <div className="mt-2 p-3 border rounded-md bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {filePreview ? (
                      formData.file.type.startsWith('image/') ? (
                        <FaImage className="h-5 w-5 text-gray-500" />
                      ) : (
                        <FaFileAlt className="h-5 w-5 text-gray-500" />
                      )
                    ) : (
                      <FaFileAlt className="h-5 w-5 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-600">
                      {filePreview ? formData.file.name : "No file selected"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {formData.file && (
                      <button
                        type="button"
                        onClick={handleDownloadFile}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaDownload className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {filePreview && formData.file.type.startsWith('image/') && (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="mt-2 max-h-40 rounded"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="important"
              checked={formData.important}
              onChange={handleChange}
            />
            <span>Mark as Important</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            <span>Publish</span>
          </label>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update Notice" : "Create Notice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditNoticeForm;
