import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { departmentService } from "../../services/departmentService";
import AdminSidebar from "../../components/layout/AdminSidebar";
import AdminNavbar from "../../components/layout/AdminNavbar";

const DepartmentsManagement = () => {
  // Auth context for role verification
  const { isAdmin, user, loading: authLoading } = useContext(AuthContext);

  // State management
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await departmentService.getAllDepartments();
        setDepartments(response);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError("Failed to load departments. Please try again later.");
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Filter departments based on search term
  const filteredDepartments = departments.filter((dept) => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Loading state component
  const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Loading departments data...</p>
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
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Departments Management</h1>
                  <p className="text-gray-600 mt-1">Manage all departments in the system</p>
                </div>
                <Link
                  to="/admin/departments/add"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Department
                </Link>
              </div>
            </div>
            
            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Departments</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept) => (
                  <div key={dept.departmentid} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white shadow-sm mr-4">
                          {dept.name.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {dept.description || "No description available"}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-sm text-gray-500">12 Users</span>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/departments/edit/${dept.departmentid}`}
                            className="text-green-600 hover:text-green-900 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            className="text-red-600 hover:text-red-900 transition-colors"
                            onClick={() => {
                              // Handle delete department
                              if (window.confirm(`Are you sure you want to delete ${dept.name}?`)) {
                                // Delete department logic
                                console.log(`Deleting department: ${dept.departmentid}`);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
                  <p className="text-gray-500">No departments found matching your criteria</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredDepartments.length}</span> of <span className="font-medium">{departments.length}</span> departments
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  Next
                </button>
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

export default DepartmentsManagement; 