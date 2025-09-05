import React from "react";
import PropTypes from "prop-types";
import {
  FaEdit,
  FaTrash,
  FaDownload,
  FaBell,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import { format } from "date-fns";

const NoticeCard = ({
  notice,
  userNames,
  isTeacher,
  onEdit,
  onDelete,
  onDownload,
  isDarkMode,
}) => {
  return (
    <div
      className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
          : "bg-white border-gray-200 hover:border-gray-300"
      } ${notice.important ? "border-l-4 border-l-red-500" : ""}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {notice.title}
              </h3>
              {notice.important && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isDarkMode
                      ? "bg-red-900/20 text-red-400"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <FaBell className="mr-1 h-3 w-3" />
                  Important
                </span>
              )}
            </div>

            <div
              className={`flex items-center text-sm mt-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <FaUser className="h-4 w-4 mr-1" />
              <span
                className={`font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {userNames[notice.userid] || "Unknown Teacher"}
              </span>
              <span className="mx-2">·</span>
              <FaCalendarAlt className="h-4 w-4 mr-1" />
              <span>
                {notice.timestamp
                  ? format(new Date(notice.timestamp), "MMM d, yyyy • h:mm a")
                  : "Date not available"}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          <p
            className={`leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {notice.content}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            {notice.filename && (
              <button
                onClick={() => onDownload(notice.noticeid, notice.filename)}
                className={`inline-flex items-center text-sm font-medium transition-colors ${
                  isDarkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                <FaDownload className="mr-2 h-4 w-4" />
                Download
              </button>
            )}
          </div>

          {isTeacher && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(notice.noticeid)}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-blue-400 hover:bg-gray-700"
                    : "text-gray-400 hover:text-blue-500 hover:bg-gray-100"
                }`}
              >
                <FaEdit className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(notice.noticeid)}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                    : "text-gray-400 hover:text-red-500 hover:bg-gray-100"
                }`}
              >
                <FaTrash className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

NoticeCard.propTypes = {
  notice: PropTypes.shape({
    noticeid: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    userid: PropTypes.number.isRequired,
    timestamp: PropTypes.string,
    filename: PropTypes.string,
    important: PropTypes.bool,
  }).isRequired,
  userNames: PropTypes.object.isRequired,
  isTeacher: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default NoticeCard;
