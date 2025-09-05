import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Building2,
  Download,
  RefreshCw,
} from "lucide-react";

const PostsManagementTab = ({ filters = {}, onStatsUpdate }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [error, setError] = useState("");

  // Fetch real posts data from API
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError("");

        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        // Prepare query parameters
        const params = {
          page: 1,
          limit: 50,
          ...(filters.search && { search: filters.search }),
          ...(filters.department !== "all" && {
            department: filters.department,
          }),
          ...(filters.userType !== "all" && { userType: filters.userType }),
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
        };

        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:3000"
          }/api/posts/admin/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params,
          }
        );

        if (response.data.success) {
          setPosts(response.data.posts || []);

          // Update stats
          if (onStatsUpdate) {
            onStatsUpdate({
              totalPosts:
                response.data.total || response.data.posts?.length || 0,
            });
          }
        } else {
          setError(response.data.message || "Failed to load posts");
        }
      } catch (error) {
        console.error("Error loading posts:", error);
        setError(error.response?.data?.message || "Failed to load posts");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [filters, onStatsUpdate]);

  // Handle post selection
  const handleSelectPost = (postId) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPosts(
      selectedPosts.length === posts.length ? [] : posts.map((p) => p.postid)
    );
  };

  // Handle post actions
  const handlePostAction = async (action, postId) => {
    try {
      switch (action) {
        case "view":
          console.log("View post:", postId);
          // Open post details modal
          break;
        case "edit":
          console.log("Edit post:", postId);
          // Open edit modal
          break;
        case "delete":
          if (window.confirm("Are you sure you want to delete this post?")) {
            setPosts((prev) => prev.filter((p) => p.postid !== postId));
          }
          break;
        default:
          console.log("Unknown action:", action);
      }
    } catch (error) {
      console.error("Error performing action:", error);
      setError(`Failed to ${action} post`);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedPosts.length === 0) return;

    try {
      switch (action) {
        case "delete":
          if (
            window.confirm(`Delete ${selectedPosts.length} selected posts?`)
          ) {
            setPosts((prev) =>
              prev.filter((p) => !selectedPosts.includes(p.postid))
            );
            setSelectedPosts([]);
          }
          break;
        case "export":
          console.log("Export posts:", selectedPosts);
          // Implement export functionality
          break;
        default:
          console.log("Unknown bulk action:", action);
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
      setError(`Failed to ${action} posts`);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
        <span className="ml-2 text-gray-300">Loading posts...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Bulk Actions Bar */}
      {selectedPosts.length > 0 && (
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-300">
              {selectedPosts.length} post{selectedPosts.length !== 1 ? "s" : ""}{" "}
              selected
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
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      posts.length > 0 && selectedPosts.length === posts.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Comments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.postid} className="hover:bg-gray-700">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.postid)}
                        onChange={() => handleSelectPost(post.postid)}
                        className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p
                          className="text-sm text-white truncate"
                          title={post.content}
                        >
                          {post.content}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                            {post.user.username.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-white">
                            {post.user.username}
                          </p>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeBadge(
                              post.user.usertype
                            )}`}
                          >
                            {post.user.usertype}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        {post.department.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDate(post.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 text-gray-400 mr-2" />
                        {post.comments.length}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePostAction("view", post.postid)}
                          className="text-blue-400 hover:text-blue-300 p-1 rounded"
                          title="View Post"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handlePostAction("edit", post.postid)}
                          className="text-green-400 hover:text-green-300 p-1 rounded"
                          title="Edit Post"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handlePostAction("delete", post.postid)
                          }
                          className="text-red-400 hover:text-red-300 p-1 rounded"
                          title="Delete Post"
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
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                    <p>No posts found matching your criteria</p>
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
      <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
        <div>
          Showing {posts.length} post{posts.length !== 1 ? "s" : ""}
        </div>
        <div>
          {selectedPosts.length > 0 && (
            <span>{selectedPosts.length} selected</span>
          )}
        </div>
      </div>
    </div>
  );
};

PostsManagementTab.propTypes = {
  filters: PropTypes.object,
  departments: PropTypes.array,
  onStatsUpdate: PropTypes.func,
};

export default PostsManagementTab;
