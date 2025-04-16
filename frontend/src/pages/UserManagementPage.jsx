import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { userService } from "../services/userService";
import { departmentService } from "../services/departmentService";

const UserManagementPage = () => {
  const navigate = useNavigate();
  const { isAdmin, user: currentUser } = useAuth();

  // State management
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch users and departments in parallel
        const [usersResponse, departmentsResponse] = await Promise.all([
          userService.getAllUsers(),
          departmentService.getAllDepartments(),
        ]);

        console.log("Users response:", usersResponse);
        console.log("Departments response:", departmentsResponse);

        // The userService.getAllUsers() already returns the array of users
        // No need to access usersResponse.users
        
        // The departmentService.getAllDepartments() already returns the array of departments
        // No need to access departmentsResponse.data

        setUsers(usersResponse);
        setDepartments(departmentsResponse);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
        setUsers([]); // Ensure users is always an array
        setDepartments([]); // Ensure departments is always an array
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAdmin, navigate]);

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === "ALL" || user.usertype === roleFilter;

    const matchesDepartment =
      departmentFilter === "ALL" ||
      user.departmentid === parseInt(departmentFilter);

    return matchesSearch && matchesRole && matchesDepartment;
  });

  // Handle role change
  const handleRoleChange = async () => {
    if (!editingUser || !selectedRole) return;

    try {
      setLoading(true);
      await userService.updateUserRole(editingUser.username, selectedRole);

      // Update local state
      setUsers(
        users.map((u) =>
          u.username === editingUser.username
            ? { ...u, usertype: selectedRole }
            : u
        )
      );

      setEditingUser(null);
      setSelectedRole("");
      setLoading(false);
    } catch (err) {
      console.error("Error updating user role:", err);
      setError("Failed to update user role. Please try again.");
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (username) => {
    try {
      setLoading(true);
      await userService.deleteUserByUsername(username);

      // Update local state
      setUsers(users.filter((u) => u.username !== username));
      setConfirmDelete(null);
      setLoading(false);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
      setLoading(false);
    }
  };

  // Handle department change
  const handleDepartmentChange = async (user, newDepartmentId) => {
    try {
      setLoading(true);
      const response = await userService.updateUserProfile({
        username: user.username,
        email: user.email,
        departmentId: newDepartmentId
      });
      
      if (response.success) {
        // Update the local users state
        setUsers(users.map(u => 
          u.userid === user.userid 
            ? { ...u, departmentid: newDepartmentId }
            : u
        ));
      }
    } catch (err) {
      console.error("Error updating department:", err);
      setError("Failed to update department. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          User Management
        </h1>
        <p className="text-gray-600">
          Manage all users in the system. You can update roles or remove users.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Users
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by username or email..."
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div>
            <label
              htmlFor="roleFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Role
            </label>
            <select
              id="roleFilter"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="TEACHER">Teacher</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label
              htmlFor="departmentFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Department
            </label>
            <select
              id="departmentFilter"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.departmentid} value={dept.departmentid}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg text-gray-800">
            Users ({filteredUsers.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Username
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.username} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        {user.username
                          ? user.username.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        {user.username === currentUser?.username && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.email || "No email"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser?.username === user.username ? (
                      <div className="flex space-x-2">
                        <select
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                        >
                          <option value="">Select Role</option>
                          <option value="ADMIN">Admin</option>
                          <option value="TEACHER">Teacher</option>
                          <option value="STUDENT">Student</option>
                        </select>
                        <button
                          onClick={handleRoleChange}
                          className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingUser(null);
                            setSelectedRole("");
                          }}
                          className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            user.usertype === "ADMIN"
                              ? "bg-red-100 text-red-800"
                              : user.usertype === "TEACHER"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {user.usertype}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.usertype === "ADMIN" ? (
                      <span className="italic text-gray-400">N/A</span>
                    ) : (
                      <select
                        value={user.departmentid || ""}
                        onChange={(e) => handleDepartmentChange(user, parseInt(e.target.value))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        disabled={loading}
                      >
                        <option value="">No Department</option>
                        {departments.map((dept) => (
                          <option key={dept.departmentid} value={dept.departmentid}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.username !== currentUser?.username && (
                      <div className="flex space-x-2">
                        {!editingUser ||
                        editingUser.username !== user.username ? (
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setSelectedRole(user.usertype);
                            }}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Change Role
                          </button>
                        ) : null}

                        {confirmDelete !== user.username ? (
                          <button
                            onClick={() => setConfirmDelete(user.username)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteUser(user.username)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {user.username === currentUser?.username && (
                      <span className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-500 bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Cannot modify yourself
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
