import { useState } from "react";
import PropTypes from "prop-types";
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Shield,
  Calendar,
} from "lucide-react";

const EnhancedUserTable = ({
  users = [],
  selectedUsers = [],
  onSelectUser,
  onSelectAll,
  onUserAction,
  departments = [],
  loading = false,
}) => {
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [actionMenuUser, setActionMenuUser] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDepartmentName = (departmentId) => {
    const dept = departments.find((d) => d.departmentid === departmentId);
    return dept ? dept.name : "No Department";
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "TEACHER":
        return "bg-green-100 text-green-800";
      case "STUDENT":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const SortableHeader = ({ field, children }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          <span className="text-blue-500">
            {sortDirection === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </th>
  );

  const UserActionMenu = ({ user }) => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
      <div className="py-1">
        <button
          onClick={() => {
            onUserAction("view", user);
            setActionMenuUser(null);
          }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
        >
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </button>
        <button
          onClick={() => {
            onUserAction("edit", user);
            setActionMenuUser(null);
          }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit User</span>
        </button>
        <button
          onClick={() => {
            onUserAction("email", user);
            setActionMenuUser(null);
          }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
        >
          <Mail className="h-4 w-4" />
          <span>Send Email</span>
        </button>
        <button
          onClick={() => {
            onUserAction("changeRole", user);
            setActionMenuUser(null);
          }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
        >
          <Shield className="h-4 w-4" />
          <span>Change Role</span>
        </button>
        <div className="border-t border-gray-200"></div>
        <button
          onClick={() => {
            onUserAction("delete", user);
            setActionMenuUser(null);
          }}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete User</span>
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    users.length > 0 && selectedUsers.length === users.length
                  }
                  onChange={onSelectAll}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </th>
              <SortableHeader field="username">User</SortableHeader>
              <SortableHeader field="usertype">Role</SortableHeader>
              <SortableHeader field="departmentid">Department</SortableHeader>
              <SortableHeader field="email">Email</SortableHeader>
              <SortableHeader field="createdAt">Created</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.userid}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedUsers.includes(user.userid) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.userid)}
                      onChange={() => onSelectUser(user.userid)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white shadow-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.userid.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(
                        user.usertype
                      )}`}
                    >
                      {user.usertype}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.usertype === "ADMIN" ? (
                      <span className="italic text-gray-400">N/A</span>
                    ) : (
                      getDepartmentName(user.departmentid)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        "active"
                      )}`}
                    >
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                    <button
                      onClick={() =>
                        setActionMenuUser(
                          actionMenuUser === user.userid ? null : user.userid
                        )
                      }
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {actionMenuUser === user.userid && (
                      <UserActionMenu user={user} />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        No users found
                      </h3>
                      <p className="text-sm text-gray-500">
                        Try adjusting your search or filter criteria.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

EnhancedUserTable.propTypes = {
  users: PropTypes.array,
  selectedUsers: PropTypes.array,
  onSelectUser: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onUserAction: PropTypes.func.isRequired,
  departments: PropTypes.array,
  loading: PropTypes.bool,
};

export default EnhancedUserTable;
