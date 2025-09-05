import { useState, useEffect, useMemo, useRef } from "react";
import useNotice from "../../hooks/useNotice";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
  FaPlus as PlusIcon,
  FaFileAlt as FileText,
  FaDownload as DownloadIcon,
  FaExclamationCircle as ImportantIcon,
  FaEdit as EditIcon,
  FaTrash as DeleteIcon,
  FaSearch,
  FaFilter,
  FaBell,
  FaClock,
  FaUser,
  FaCalendarAlt,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFile,
} from "react-icons/fa";
import { userService } from "../../services/userService";
import { format } from "date-fns";
import { departmentService } from "../../services/departmentService";

const NoticeContainer = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const {
    notices = [],
    loading,
    error,
    isTeacher,
    fetchNotices: fetchNoticesFromHook,
    updateNotice,
    deleteNotice,
    downloadAttachment,
  } = useNotice();

  const [userNames, setUserNames] = useState({});
  const [departments, setDepartments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, important, recent
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, important

  // Ref to track initial fetch
  const hasInitialFetch = useRef(false);

  useEffect(() => {
    const fetchUserNames = async () => {
      if (!notices || notices.length === 0) return;

      // Fetch user names for all unique user IDs
      const uniqueUserIds = [
        ...new Set(notices.map((notice) => notice.userid)),
      ];
      const namePromises = uniqueUserIds.map(async (userId) => {
        try {
          const userResponse = await userService.getUserById(userId);
          return { userId, name: userResponse.data.username };
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          return { userId, name: "Unknown Teacher" };
        }
      });

      const userNamesData = await Promise.all(namePromises);
      const namesMap = userNamesData.reduce((acc, { userId, name }) => {
        acc[userId] = name;
        return acc;
      }, {});

      setUserNames(namesMap);
    };

    const fetchDepartments = async () => {
      if (!notices || notices.length === 0) return;

      try {
        // Get unique department IDs from notices
        const uniqueDeptIds = [
          ...new Set(notices.map((notice) => notice.departmentid)),
        ];

        // Fetch departments in parallel
        const departmentPromises = uniqueDeptIds.map(async (deptId) => {
          try {
            const response = await departmentService.getDepartmentById(deptId);
            return response;
          } catch (error) {
            console.error(`Error fetching department ${deptId}:`, error);
            return null; // Return null for failed fetches
          }
        });

        const departments = await Promise.all(departmentPromises);
        // Filter out any null values from failed fetches
        const validDepartments = departments.filter((dept) => dept !== null);
        setDepartments(validDepartments);
      } catch (error) {
        console.error("Error in fetchDepartments:", error);
        setDepartments([]); // Set empty array on error
      }
    };

    fetchUserNames();
    fetchDepartments();
  }, [notices]);

  // Initial fetch
  useEffect(() => {
    if (!hasInitialFetch.current) {
      hasInitialFetch.current = true;
      fetchNoticesFromHook();
    }
  }, [fetchNoticesFromHook]);

  // Filter and sort notices
  const filteredAndSortedNotices = useMemo(() => {
    let filtered = notices.filter((notice) => {
      const matchesSearch =
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchTerm.toLowerCase());

      switch (filterType) {
        case "important":
          return matchesSearch && notice.important;
        case "recent": {
          const threeDaysAgo = new Date();
          threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
          return matchesSearch && new Date(notice.timestamp) > threeDaysAgo;
        }
        default:
          return matchesSearch;
      }
    });

    // Sort notices
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.timestamp) - new Date(b.timestamp);
        case "important":
          if (a.important && !b.important) return -1;
          if (!a.important && b.important) return 1;
          return new Date(b.timestamp) - new Date(a.timestamp);
        default: // newest
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });
  }, [notices, searchTerm, filterType, sortBy]);

  // Get file icon based on file type
  const getFileIcon = (filename) => {
    if (!filename) return FaFile;
    const extension = filename.split(".").pop()?.toLowerCase();
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
        return FaFile;
    }
  };

  // Manual refresh handler
  const handleRefresh = () => {
    fetchNoticesFromHook();
  };

  // Handlers
  const handleCreateNotice = () => navigate("/notices/create");

  const handleDelete = async (noticeId) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      await deleteNotice(noticeId);
      fetchNoticesFromHook();
    }
  };

  const handleEdit = (noticeId) => {
    navigate(`/notices/edit/${noticeId}`);
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-7xl mx-auto">
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
              Loading notices...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`border-l-4 border-red-500 p-4 rounded-lg ${
              isDarkMode ? "bg-red-900/20" : "bg-red-50"
            }`}
          >
            <div className="flex items-center">
              <ImportantIcon className="text-red-400 mr-2" />
              <div>
                <h3
                  className={`text-lg font-medium ${
                    isDarkMode ? "text-red-400" : "text-red-800"
                  }`}
                >
                  Error Loading Notices
                </h3>
                <p
                  className={`mt-2 text-sm ${
                    isDarkMode ? "text-red-300" : "text-red-700"
                  }`}
                >
                  {error}
                </p>
                <button
                  onClick={handleRefresh}
                  className={`mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
                    isDarkMode
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-100 hover:bg-red-200 text-red-700"
                  }`}
                >
                  Try Again
                </button>
              </div>
            </div>
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
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Search and Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <FaSearch
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`appearance-none pl-4 pr-8 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Notices</option>
                <option value="important">Important</option>
                <option value="recent">Recent</option>
              </select>
              <FaFilter
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`appearance-none pl-4 pr-8 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="important">Important First</option>
              </select>
              <FaClock
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>

            {/* Create Notice Button */}
            {isTeacher && (
              <button
                onClick={handleCreateNotice}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <PlusIcon className="mr-2 h-5 w-5" />
                Create Notice
              </button>
            )}
          </div>
        </div>

        {/* Notices Grid */}
        <div className="space-y-6">
          {filteredAndSortedNotices.map((notice) => {
            const FileIcon = getFileIcon(notice.filename);
            return (
              <div
                key={notice.noticeid}
                className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                    : "bg-white border-gray-200 hover:border-gray-300"
                } ${notice.important ? "border-l-4 border-l-red-500" : ""}`}
              >
                <div className="p-6">
                  {/* Notice Header */}
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
                            ? format(
                                new Date(notice.timestamp),
                                "MMM d, yyyy • h:mm a"
                              )
                            : "Date not available"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notice Content */}
                  <div className="mt-4">
                    <p
                      className={`whitespace-pre-wrap leading-relaxed ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {notice.content}
                    </p>
                  </div>

                  {/* Department Info */}
                  {departments[notice.departmentid]?.name && (
                    <div className="mt-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          isDarkMode
                            ? "bg-blue-900/20 text-blue-400"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {departments[notice.departmentid].name}
                      </span>
                    </div>
                  )}

                  {/* File Attachment */}
                  {notice.filename && (
                    <div className="mt-4">
                      <div
                        className={`flex items-center justify-between p-4 rounded-lg border-2 border-dashed transition-colors ${
                          isDarkMode
                            ? "bg-gray-700/50 border-gray-600 hover:border-blue-500"
                            : "bg-gray-50 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        <div className="flex items-center">
                          <FileIcon
                            className={`h-6 w-6 mr-3 ${
                              isDarkMode ? "text-blue-400" : "text-blue-500"
                            }`}
                          />
                          <div>
                            <span
                              className={`text-sm font-medium block ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {notice.filename}
                            </span>
                            <span
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Click to download
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            downloadAttachment(notice.noticeid, notice.filename)
                          }
                          className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isDarkMode
                              ? "text-blue-400 bg-blue-900/20 hover:bg-blue-900/30"
                              : "text-blue-600 bg-blue-100 hover:bg-blue-200"
                          }`}
                        >
                          <DownloadIcon className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions - Teacher Only */}
                  {isTeacher && (
                    <div className="mt-6 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(notice.noticeid)}
                        className={`p-2 rounded-full transition-colors ${
                          isDarkMode
                            ? "text-gray-400 hover:text-blue-400 hover:bg-gray-700"
                            : "text-gray-400 hover:text-blue-500 hover:bg-gray-100"
                        }`}
                        title="Edit Notice"
                      >
                        <EditIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(notice.noticeid)}
                        className={`p-2 rounded-full transition-colors ${
                          isDarkMode
                            ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                            : "text-gray-400 hover:text-red-500 hover:bg-gray-100"
                        }`}
                        title="Delete Notice"
                      >
                        <DeleteIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredAndSortedNotices.length === 0 && (
            <div className="text-center py-12">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <FileText
                  className={`h-8 w-8 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>
              <h3
                className={`text-lg font-medium mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {searchTerm || filterType !== "all"
                  ? "No matching notices found"
                  : "No notices found"}
              </h3>
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "There are no notices to display at the moment."}
              </p>
              {(searchTerm || filterType !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                  }}
                  className={`mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeContainer;
