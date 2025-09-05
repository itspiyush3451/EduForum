import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ContentFilters from "../../components/admin/ContentFilters";
import PostsManagementTab from "../../components/admin/PostsManagementTab";
import NoticesManagementTab from "../../components/admin/NoticesManagementTab";
import { departmentService } from "../../services/departmentService";
import {
  FileText,
  MessageSquare,
  Filter,
  Download,
  Eye,
  Users,
  Calendar,
  Search,
} from "lucide-react";

const ContentManagement = () => {
  // Auth context for role verification
  const { user, loading: authLoading } = useContext(AuthContext);
  const isAdmin = user?.role === "ADMIN";

  // State management
  const [activeTab, setActiveTab] = useState("posts");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    department: "all",
    userType: "all",
    dateRange: "all",
    startDate: "",
    endDate: "",
  });

  // Statistics
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalNotices: 0,
    activeUsers: 0,
    todayActivity: 0,
  });

  // Load departments and initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const deptResponse = await departmentService.getAllDepartments();
        if (deptResponse.success) {
          setDepartments(deptResponse.departments || []);
        }
        // Load basic statistics here if needed
        setStats({
          totalPosts: 0,
          totalNotices: 0,
          activeUsers: 0,
          todayActivity: 0,
        });
      } catch (error) {
        console.error("Error loading initial data:", error);
        setError("Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isAdmin) {
      loadInitialData();
    }
  }, [authLoading, isAdmin]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Tab configuration
  const tabs = [
    {
      id: "posts",
      label: "Posts Management",
      icon: MessageSquare,
      count: stats.totalPosts,
      description: "Manage all user posts across departments",
    },
    {
      id: "notices",
      label: "Notices Management",
      icon: FileText,
      count: stats.totalNotices,
      description: "Manage notices and announcements",
    },
  ];

  // Loading and auth checks
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authLoading && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Filter className="h-6 w-6 mr-3 text-blue-400" />
              Content Management
            </h1>
            <p className="text-gray-300 mt-1">
              Manage all posts and notices across departments with advanced
              filtering
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Total Content</div>
              <div className="text-2xl font-bold text-white">
                {stats.totalPosts + stats.totalNotices}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-sm">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-300">Total Posts</p>
              <p className="text-2xl font-semibold text-white">
                {stats.totalPosts}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-sm">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-300">Total Notices</p>
              <p className="text-2xl font-semibold text-white">
                {stats.totalNotices}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-sm">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-300">Active Users</p>
              <p className="text-2xl font-semibold text-white">
                {stats.activeUsers}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-300">
                Today's Activity
              </p>
              <p className="text-2xl font-semibold text-white">
                {stats.todayActivity}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Advanced Filters */}
      <ContentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        departments={departments}
        activeTab={activeTab}
      />

      {/* Tab Navigation */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 mb-6">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-blue-400 text-blue-400"
                      : "border-transparent text-gray-300 hover:text-white hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        isActive
                          ? "bg-blue-900/50 text-blue-300"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {tab.description}
                  </p>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "posts" && (
            <PostsManagementTab
              filters={filters}
              departments={departments}
              onStatsUpdate={(newStats) =>
                setStats((prev) => ({ ...prev, ...newStats }))
              }
            />
          )}
          {activeTab === "notices" && (
            <NoticesManagementTab
              filters={filters}
              departments={departments}
              onStatsUpdate={(newStats) =>
                setStats((prev) => ({ ...prev, ...newStats }))
              }
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()} EduForum Content Management. All rights
          reserved.
        </p>
      </div>
    </>
  );
};

export default ContentManagement;
