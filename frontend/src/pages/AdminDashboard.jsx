import React, { useState, useEffect, useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { departmentService } from "../services/departmentService";
import { userService } from "../services/userService";
import AdminSidebar from "../components/layout/AdminSidebar";
import AdminNavbar from "../components/layout/AdminNavbar";

const AdminDashboard = () => {
  // Auth context for role verification
  const { isAdmin, user, loading: authLoading } = useContext(AuthContext);

  // State management
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDepartments: 0,
    adminUsers: 0,
    teacherUsers: 0,
    studentUsers: 0,
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Starting to fetch admin dashboard data...");

        // Fetch users and departments in parallel
        const [usersResponse, departmentsResponse] = await Promise.all([
          userService.getAllUsers(),
          departmentService.getAllDepartments(),
        ]);

        console.log("Users response:", usersResponse);
        console.log("Departments response:", departmentsResponse);

        // Set data from responses
        setUsers(Array.isArray(usersResponse) ? usersResponse : []);
        setDepartments(Array.isArray(departmentsResponse) ? departmentsResponse : []);

        // Calculate statistics
        const adminCount = (Array.isArray(usersResponse) ? usersResponse : []).filter(
          (user) => user.usertype === "ADMIN"
        ).length;
        const teacherCount = (Array.isArray(usersResponse) ? usersResponse : []).filter(
          (user) => user.usertype === "TEACHER"
        ).length;
        const studentCount = (Array.isArray(usersResponse) ? usersResponse : []).filter(
          (user) => user.usertype === "STUDENT"
        ).length;

        setStats({
          totalUsers: Array.isArray(usersResponse) ? usersResponse.length : 0,
          totalDepartments: Array.isArray(departmentsResponse) ? departmentsResponse.length : 0,
          adminUsers: adminCount,
          teacherUsers: teacherCount,
          studentUsers: studentCount,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state component
  const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

  // Stat Card Component
  const StatCard = ({ icon, color, title, value, children }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 border border-gray-100">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-500 mr-4 shadow-sm`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
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
        <AdminSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        <main className={`flex-1 p-4 md:p-6 mt-16 ${isSidebarCollapsed ? 'ml-16' : 'ml-16 md:ml-64'} transition-all duration-300`}>
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.username}. Here's what's happening in your system.</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                color="blue"
                title="Total Users"
                value={stats.totalUsers}
              >
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="text-center px-2 py-1 bg-blue-50 rounded-lg shadow-sm">
                    <p className="text-xs font-medium text-gray-500">Students</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.studentUsers}</p>
                  </div>
                  <div className="text-center px-2 py-1 bg-green-50 rounded-lg shadow-sm">
                    <p className="text-xs font-medium text-gray-500">Teachers</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.teacherUsers}</p>
                  </div>
                  <div className="text-center px-2 py-1 bg-purple-50 rounded-lg shadow-sm">
                    <p className="text-xs font-medium text-gray-500">Admins</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.adminUsers}</p>
                  </div>
                </div>
              </StatCard>

              <StatCard 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
                color="green"
                title="Departments"
                value={stats.totalDepartments}
              >
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">Active departments</p>
                  <Link to="/admin/departments" className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors">
                    View all
                  </Link>
                </div>
              </StatCard>

              <StatCard 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                color="purple"
                title="System Status"
                value="Online"
              >
                <div className="mt-4 flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-sm text-gray-500">All systems operational</p>
                </div>
              </StatCard>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
                  <Link
                    to="/admin/users"
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    View All
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.slice(0, 5).map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white shadow-sm">
                                  {user.username.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${user.usertype === "ADMIN" ? "bg-purple-100 text-purple-800" : 
                                user.usertype === "TEACHER" ? "bg-green-100 text-green-800" : 
                                "bg-blue-100 text-blue-800"}`}>
                              {user.usertype}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.usertype === "ADMIN" ? 
                              <span className="italic text-gray-400">N/A</span> : 
                              departments.find((d) => d.departmentid === user.departmentid)?.name || 
                              <span className="text-yellow-600">No Department</span>}
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Departments */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Departments</h2>
                  <Link
                    to="/admin/departments"
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    Manage
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {departments.slice(0, 5).map((dept) => (
                        <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-md bg-green-100 text-green-700 flex items-center justify-center mr-3 shadow-sm">
                                {dept.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {dept.description || <span className="italic text-gray-400">No description</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full shadow-sm">
                                {users.filter((u) => u.departmentid === dept.departmentid).length} users
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {departments.length === 0 && (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                            No departments found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickActionCard
                  to="/admin/users"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  }
                  color="blue"
                  title="Manage Users"
                />

                <QuickActionCard
                  to="/admin/departments"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  }
                  color="green"
                  title="Manage Departments"
                />

                <QuickActionCard
                  to="/settings"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                  color="gray"
                  title="System Settings"
                />

                <QuickActionCard
                  to="/admin/reports"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                  color="indigo"
                  title="View Reports"
                />
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

// Quick Action Card Component
const QuickActionCard = ({ to, icon, color, title }) => (
  <Link
    to={to}
    className="bg-white rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-lg hover:bg-gray-50 flex items-center border border-gray-100 hover:scale-105 hover:border-gray-200 hover:translate-y-[-2px]"
  >
    <div className={`p-2 rounded-full bg-${color}-100 text-${color}-500 mr-3 shadow-sm transition-all duration-300 group-hover:scale-110`}>
      {icon}
    </div>
    <span className="font-medium text-gray-900 transition-colors duration-300 group-hover:text-blue-600">{title}</span>
  </Link>
);

export default AdminDashboard;