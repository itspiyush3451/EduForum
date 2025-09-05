import React, { useState } from "react";
import PropTypes from "prop-types";
import { Calendar, Filter, Download, Users, Search } from "lucide-react";

const AdvancedUserFilters = ({
  onFilterChange,
  onExport,
  departments = [],
  totalUsers = 0,
  filteredCount = 0,
}) => {
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    department: "all",
    status: "all",
    dateRange: "all",
    sortBy: "created_desc",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      search: "",
      role: "all",
      department: "all",
      status: "all",
      dateRange: "all",
      sortBy: "created_desc",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(
      ([key, value]) => value !== "all" && value !== "" && key !== "sortBy"
    ).length;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              User Management
            </h3>
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredCount} of {totalUsers} users
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showAdvanced
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4 mr-1 inline" />
            Advanced Filters
            {getActiveFilterCount() > 0 && (
              <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
          <button
            onClick={onExport}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Download className="h-4 w-4 mr-1 inline" />
            Export
          </button>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Role Filter */}
        <select
          value={filters.role}
          onChange={(e) => handleFilterChange("role", e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="TEACHER">Teacher</option>
          <option value="STUDENT">Student</option>
        </select>

        {/* Department Filter */}
        <select
          value={filters.department}
          onChange={(e) => handleFilterChange("department", e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.departmentid} value={dept.departmentid}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e.target.value)
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="created_desc">Recently Created</option>
                <option value="created_asc">Oldest First</option>
                <option value="name_asc">Name A-Z</option>
                <option value="name_desc">Name Z-A</option>
                <option value="email_asc">Email A-Z</option>
                <option value="role_asc">Role A-Z</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearAllFilters}
                className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">
              Active Filters:
            </span>
            {Object.entries(filters).map(([key, value]) => {
              if (value === "all" || value === "" || key === "sortBy")
                return null;

              const filterLabels = {
                search: `Search: "${value}"`,
                role: `Role: ${value}`,
                department: `Department: ${
                  departments.find((d) => d.departmentid == value)?.name ||
                  value
                }`,
                status: `Status: ${value}`,
                dateRange: `Created: ${value}`,
              };

              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {filterLabels[key]}
                  <button
                    onClick={() =>
                      handleFilterChange(key, key === "search" ? "" : "all")
                    }
                    className="ml-2 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

AdvancedUserFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  departments: PropTypes.array,
  totalUsers: PropTypes.number,
  filteredCount: PropTypes.number,
};

export default AdvancedUserFilters;
