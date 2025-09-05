import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";
import { departmentService } from "../../services/departmentService";
import AdminSidebar from "../../components/layout/AdminSidebar";
import AdminNavbar from "../../components/layout/AdminNavbar";
import AdvancedUserFilters from "../../components/admin/AdvancedUserFilters";
import BulkUserActions from "../../components/admin/BulkUserActions";
import EnhancedUserTable from "../../components/admin/EnhancedUserTable";

const UsersManagement = () => {
  // Auth context for role verification
  const { isAdmin, loading: authLoading } = useAuth();

  // State management
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersResponse, departmentsResponse] = await Promise.all([
          userService.getAllUsers(),
          departmentService.getAllDepartments(),
        ]);

        setUsers(usersResponse || []);
        setFilteredUsers(usersResponse || []);
        setDepartments(departmentsResponse || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters) => {
    let filtered = [...users];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Role filter
    if (filters.role !== "all") {
      filtered = filtered.filter((user) => user.usertype === filters.role);
    }

    // Department filter
    if (filters.department !== "all") {
      filtered = filtered.filter(
        (user) => user.departmentid == filters.department
      );
    }

    // Status filter (mock implementation)
    if (filters.status !== "all") {
      // Add status filtering logic when status field is available
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      if (filters.dateRange !== "all") {
        filtered = filtered.filter(
          (user) => new Date(user.createdAt) >= filterDate
        );
      }
    }

    // Sort
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case "created_desc":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "created_asc":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "name_asc":
            return a.username.localeCompare(b.username);
          case "name_desc":
            return b.username.localeCompare(a.username);
          case "email_asc":
            return a.email.localeCompare(b.email);
          case "role_asc":
            return a.usertype.localeCompare(b.usertype);
          default:
            return 0;
        }
      });
    }

    setFilteredUsers(filtered);
  };

  // Handle user selection
  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map((user) => user.userid)
    );
  };

  // Handle bulk actions
  const handleBulkAction = async (action, userIds) => {
    try {
      switch (action) {
        case "activate":
          console.log("Activating users:", userIds);
          // TODO: Implement bulk activate API
          break;
        case "deactivate":
          console.log("Deactivating users:", userIds);
          // TODO: Implement bulk deactivate API
          break;
        case "delete":
          if (
            window.confirm(
              `Are you sure you want to delete ${userIds.length} users?`
            )
          ) {
            console.log("Deleting users:", userIds);
            // TODO: Implement bulk delete API
          }
          break;
        case "export":
          handleExportUsers(userIds);
          break;
        case "clear":
          setSelectedUsers([]);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Bulk action error:", error);
      setError(`Failed to perform bulk action: ${error.message}`);
    }
  };

  // Handle individual user actions
  const handleUserAction = async (action, user) => {
    try {
      switch (action) {
        case "view":
          console.log("Viewing user:", user);
          // TODO: Navigate to user details page
          break;
        case "edit":
          console.log("Editing user:", user);
          // TODO: Navigate to user edit page
          break;
        case "email":
          console.log("Emailing user:", user);
          // TODO: Open email compose
          break;
        case "changeRole":
          console.log("Changing role for user:", user);
          // TODO: Open role change modal
          break;
        case "delete":
          if (
            window.confirm(`Are you sure you want to delete ${user.username}?`)
          ) {
            console.log("Deleting user:", user);
            // TODO: Implement delete user API
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("User action error:", error);
      setError(`Failed to perform action: ${error.message}`);
    }
  };

  // Handle export
  const handleExportUsers = (userIds = null) => {
    const usersToExport = userIds
      ? filteredUsers.filter((user) => userIds.includes(user.userid))
      : filteredUsers;

    const csvContent = [
      ["Username", "Email", "Role", "Department", "Created At"],
      ...usersToExport.map((user) => [
        user.username,
        user.email,
        user.usertype,
        departments.find((d) => d.departmentid === user.departmentid)?.name ||
          "N/A",
        new Date(user.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Loading state component
  const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Loading users data...</p>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold">Error</h2>
        </div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Show loading state while auth is initializing
  if (authLoading) {
    return <LoadingState />;
  }

  // Only redirect if we're sure the user is not an admin
  if (!authLoading && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
        <main
          className={`flex-1 p-4 md:p-6 mt-16 ${
            isSidebarCollapsed ? "ml-16" : "ml-16 md:ml-64"
          } transition-all duration-300`}
        >
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Users Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all users in the system with advanced filtering and bulk
                operations
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Advanced Filters */}
            <AdvancedUserFilters
              onFilterChange={handleFilterChange}
              onExport={() => handleExportUsers()}
              departments={departments}
              totalUsers={users.length}
              filteredCount={filteredUsers.length}
            />

            {/* Bulk Actions */}
            <BulkUserActions
              selectedUsers={selectedUsers}
              onBulkAction={handleBulkAction}
              onSelectAll={handleSelectAll}
              totalUsers={filteredUsers.length}
              allSelected={
                selectedUsers.length === filteredUsers.length &&
                filteredUsers.length > 0
              }
            />

            {/* Enhanced User Table */}
            <EnhancedUserTable
              users={filteredUsers}
              selectedUsers={selectedUsers}
              onSelectUser={handleSelectUser}
              onSelectAll={handleSelectAll}
              onUserAction={handleUserAction}
              departments={departments}
              loading={loading}
            />

            {/* Pagination (Future Enhancement) */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{filteredUsers.length}</span> of{" "}
                <span className="font-medium">{users.length}</span> users
              </div>
              <div className="text-sm text-gray-500">
                {selectedUsers.length > 0 && (
                  <span>
                    {selectedUsers.length} user
                    {selectedUsers.length !== 1 ? "s" : ""} selected
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center py-6 text-sm text-gray-500">
              <p>© {new Date().getFullYear()} EduForum. All rights reserved.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UsersManagement;
