import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  Paperclip,
  User,
  Calendar,
  Building2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const NoticesManagementTab = ({
  filters = {},
  departments = [],
  onStatsUpdate,
}) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotices, setSelectedNotices] = useState([]);
  const [error, setError] = useState("");

  // Mock data for development - will be replaced with actual API calls
  useEffect(() => {
    const loadNotices = async () => {
      try {
        setLoading(true);
        // Mock notices data
        const mockNotices = [
          {
            noticeid: 1,
            title: "Important: Mid-term Examination Schedule",
            content:
              "The mid-term examinations for all Computer Science courses will be held from October 15-20, 2024. Please check the detailed schedule on the department portal.",
            timestamp: "2024-09-01T08:00:00Z",
            filename: "midterm_schedule.pdf",
            userid: "user1",
            user: {
              username: "cs_admin",
              usertype: "TEACHER",
            },
            departmentid: 1,
            department: {
              name: "Computer Science",
            },
            priority: "high",
          },
          {
            noticeid: 2,
            title: "Library Hours Update",
            content:
              "Starting from September 15th, the library will be open from 8 AM to 10 PM on weekdays and 9 AM to 8 PM on weekends.",
            timestamp: "2024-09-02T12:00:00Z",
            filename: null,
            userid: "user2",
            user: {
              username: "library_admin",
              usertype: "ADMIN",
            },
            departmentid: 2,
            department: {
              name: "General",
            },
            priority: "medium",
          },
          {
            noticeid: 3,
            title: "Mathematics Workshop Registration",
            content:
              "Registration is now open for the Advanced Calculus workshop. Limited seats available. Register before September 20th.",
            timestamp: "2024-09-03T15:30:00Z",
            filename: "workshop_details.docx",
            userid: "user3",
            user: {
              username: "math_prof",
              usertype: "TEACHER",
            },
            departmentid: 3,
            department: {
              name: "Mathematics",
            },
            priority: "low",
          },
        ];

        // Apply filters
        let filteredNotices = mockNotices;

        if (filters.search) {
          filteredNotices = filteredNotices.filter(
            (notice) =>
              notice.title
                .toLowerCase()
                .includes(filters.search.toLowerCase()) ||
              notice.content
                .toLowerCase()
                .includes(filters.search.toLowerCase()) ||
              notice.user.username
                .toLowerCase()
                .includes(filters.search.toLowerCase())
          );
        }

        if (filters.department && filters.department !== "all") {
          filteredNotices = filteredNotices.filter(
            (notice) =>
              notice.departmentid.toString() === filters.department.toString()
          );
        }

        if (filters.userType && filters.userType !== "all") {
          filteredNotices = filteredNotices.filter(
            (notice) => notice.user.usertype === filters.userType
          );
        }

        setNotices(filteredNotices);

        // Update stats
        if (onStatsUpdate) {
          onStatsUpdate({
            totalNotices: filteredNotices.length,
            activeUsers: new Set(filteredNotices.map((n) => n.userid)).size,
          });
        }
      } catch (error) {
        console.error("Error loading notices:", error);
        setError("Failed to load notices");
      } finally {
        setLoading(false);
      }
    };

    loadNotices();
  }, [filters, onStatsUpdate]);

  // Handle notice selection
  const handleSelectNotice = (noticeId) => {
    setSelectedNotices((prev) =>
      prev.includes(noticeId)
        ? prev.filter((id) => id !== noticeId)
        : [...prev, noticeId]
    );
  };

  const handleSelectAll = () => {
    setSelectedNotices(
      selectedNotices.length === notices.length
        ? []
        : notices.map((n) => n.noticeid)
    );
  };

  // Handle notice actions
  const handleNoticeAction = async (action, noticeId) => {
    try {
      switch (action) {
        case "view":
          console.log("View notice:", noticeId);
          // Open notice details modal
          break;
        case "edit":
          console.log("Edit notice:", noticeId);
          // Open edit modal
          break;
        case "delete":
          if (window.confirm("Are you sure you want to delete this notice?")) {
            setNotices((prev) => prev.filter((n) => n.noticeid !== noticeId));
          }
          break;
        case "download":
          console.log("Download attachment for notice:", noticeId);
          // Implement download functionality
          break;
        default:
          console.log("Unknown action:", action);
      }
    } catch (error) {
      console.error("Error performing action:", error);
      setError(`Failed to ${action} notice`);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedNotices.length === 0) return;

    try {
      switch (action) {
        case "delete":
          if (
            window.confirm(`Delete ${selectedNotices.length} selected notices?`)
          ) {
            setNotices((prev) =>
              prev.filter((n) => !selectedNotices.includes(n.noticeid))
            );
            setSelectedNotices([]);
          }
          break;
        case "export":
          console.log("Export notices:", selectedNotices);
          // Implement export functionality
          break;
        default:
          console.log("Unknown bulk action:", action);
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
      setError(`Failed to ${action} notices`);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get user type badge color
  const getUserTypeBadge = (userType) => {
    const colors = {
      ADMIN: "bg-purple-100 text-purple-800",
      TEACHER: "bg-green-100 text-green-800",
      STUDENT: "bg-blue-100 text-blue-800",
    };
    return colors[userType] || "bg-gray-100 text-gray-800";
  };

  // Get priority badge color
  const getPriorityBadge = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading notices...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Bulk Actions Bar */}
      {selectedNotices.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedNotices.length} notice
              {selectedNotices.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction("export")}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Notices Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      notices.length > 0 &&
                      selectedNotices.length === notices.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title & Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attachment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <tr key={notice.noticeid} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedNotices.includes(notice.noticeid)}
                        onChange={() => handleSelectNotice(notice.noticeid)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-sm">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {notice.title}
                        </p>
                        <p
                          className="text-xs text-gray-600 truncate"
                          title={notice.content}
                        >
                          {notice.content}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                            {notice.user.username.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {notice.user.username}
                          </p>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeBadge(
                              notice.user.usertype
                            )}`}
                          >
                            {notice.user.usertype}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        {notice.department.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(
                            notice.priority
                          )}`}
                        >
                          {notice.priority.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDate(notice.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {notice.filename ? (
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                          <button
                            onClick={() =>
                              handleNoticeAction("download", notice.noticeid)
                            }
                            className="text-blue-600 hover:text-blue-800 text-xs"
                            title={notice.filename}
                          >
                            {notice.filename.length > 15
                              ? `${notice.filename.substring(0, 15)}...`
                              : notice.filename}
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          No attachment
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleNoticeAction("view", notice.noticeid)
                          }
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Notice"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleNoticeAction("edit", notice.noticeid)
                          }
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Edit Notice"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {notice.filename && (
                          <button
                            onClick={() =>
                              handleNoticeAction("download", notice.noticeid)
                            }
                            className="text-purple-600 hover:text-purple-900 p-1 rounded"
                            title="Download Attachment"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleNoticeAction("delete", notice.noticeid)
                          }
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Notice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No notices found matching your criteria</p>
                    {Object.values(filters).some((f) => f && f !== "all") && (
                      <p className="text-sm mt-1">Try adjusting your filters</p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {notices.length} notice{notices.length !== 1 ? "s" : ""}
        </div>
        <div>
          {selectedNotices.length > 0 && (
            <span>{selectedNotices.length} selected</span>
          )}
        </div>
      </div>
    </div>
  );
};

NoticesManagementTab.propTypes = {
  filters: PropTypes.object,
  departments: PropTypes.array,
  onStatsUpdate: PropTypes.func,
};

export default NoticesManagementTab;
