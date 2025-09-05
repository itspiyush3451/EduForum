import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotice } from "../../context/NoticeContext";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaFileAlt,
  FaDownload,
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";

const NoticeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isTeacher } = useAuth();
  const { isDarkMode } = useTheme();
  const { getNoticeById, deleteNotice } = useNotice();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get file icon based on file type
  const getFileIcon = (filename) => {
    if (!filename) return FaFileAlt;
    const extension = filename.split(".").pop().toLowerCase();

    switch (extension) {
      case "pdf":
        return FaFilePdf;
      case "doc":
      case "docx":
        return FaFileWord;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return FaFileImage;
      default:
        return FaFileAlt;
    }
  };

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const data = await getNoticeById(id);
        setNotice(data);
      } catch (err) {
        setError("Failed to load notice details");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id, getNoticeById]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await deleteNotice(id);
        navigate("/notices");
      } catch (err) {
        setError("Failed to delete notice");
      }
    }
  };

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
              Loading notice details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate("/notices")}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Back to Notices
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <svg
                className="h-8 w-8 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Notice not found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              The requested notice could not be found.
            </p>
            <button
              onClick={() => navigate("/notices")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Notices
            </button>
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
            onClick={() => navigate("/notices")}
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

        {/* Notice Card */}
        <div
          className={`rounded-xl shadow-sm overflow-hidden border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="p-6 sm:p-8">
            {/* Notice Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  {notice.important && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 ${
                        isDarkMode
                          ? "bg-red-900/20 text-red-400 border border-red-800"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      <FaExclamationTriangle className="mr-1 h-3 w-3" />
                      Important
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isDarkMode
                        ? "bg-green-900/20 text-green-400 border border-green-800"
                        : "bg-green-100 text-green-800 border border-green-200"
                    }`}
                  >
                    Published
                  </span>
                </div>
                <h1
                  className={`text-3xl font-bold mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {notice.title}
                </h1>
                <div
                  className={`flex flex-wrap items-center gap-4 text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <div className="flex items-center">
                    <FaUser className="mr-2 h-4 w-4" />
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {notice.author.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 h-4 w-4" />
                    <span>
                      {new Date(notice.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isTeacher && (
                <div className="flex space-x-3 mt-6 lg:mt-0">
                  <button
                    onClick={() => navigate(`/notices/edit/${id}`)}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isDarkMode
                        ? "text-blue-400 bg-blue-900/20 hover:bg-blue-900/30 border border-blue-800 focus:ring-blue-500"
                        : "text-blue-700 bg-blue-100 hover:bg-blue-200 border border-blue-200 focus:ring-blue-500"
                    }`}
                  >
                    <FaEdit className="mr-2 h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isDarkMode
                        ? "text-red-400 bg-red-900/20 hover:bg-red-900/30 border border-red-800 focus:ring-red-500"
                        : "text-red-700 bg-red-100 hover:bg-red-200 border border-red-200 focus:ring-red-500"
                    }`}
                  >
                    <FaTrash className="mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Notice Content */}
            <div className="mb-8">
              <h2
                className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Notice Content
              </h2>
              <div
                className={`prose max-w-none ${
                  isDarkMode ? "prose-invert" : ""
                }`}
              >
                <p
                  className={`leading-relaxed whitespace-pre-wrap ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {notice.content}
                </p>
              </div>
            </div>

            {/* File Attachment */}
            {notice.fileUrl && (
              <div>
                <h3
                  className={`text-lg font-semibold mb-3 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Attachment
                </h3>
                <div
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center flex-1">
                    {React.createElement(getFileIcon(notice.filename), {
                      className: `h-6 w-6 mr-3 ${
                        isDarkMode ? "text-blue-400" : "text-blue-500"
                      }`,
                    })}
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {notice.filename || "Attachment"}
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Click to download
                      </p>
                    </div>
                  </div>
                  <a
                    href={notice.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isDarkMode
                        ? "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                        : "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                    }`}
                  >
                    <FaDownload className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetails;
