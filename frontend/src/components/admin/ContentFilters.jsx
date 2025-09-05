import { useState } from "react";
import PropTypes from "prop-types";
import {
  Filter,
  Search,
  Calendar,
  User,
  Building,
  FileText,
  X,
} from "lucide-react";

const ContentFilters = ({
  filters = {},
  onFilterChange,
  departments = [],
  activeTab = "posts",
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  // Handle date range preset changes
  const handleDateRangeChange = (range) => {
    const today = new Date();
    let startDate = "";
    let endDate = "";

    switch (range) {
      case "today": {
        startDate = today.toISOString().split("T")[0];
        endDate = startDate;
        break;
      }
      case "week": {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        startDate = weekAgo.toISOString().split("T")[0];
        endDate = today.toISOString().split("T")[0];
        break;
      }
      case "month": {
        const monthAgo = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate()
        );
        startDate = monthAgo.toISOString().split("T")[0];
        endDate = today.toISOString().split("T")[0];
        break;
      }
      case "all":
      default:
        startDate = "";
        endDate = "";
        break;
    }

    onFilterChange({
      dateRange: range,
      startDate,
      endDate,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      search: "",
      department: "all",
      userType: "all",
      dateRange: "all",
      startDate: "",
      endDate: "",
    });
  };

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "search" && value && value.trim()) return true;
      if (
        ["department", "userType", "dateRange"].includes(key) &&
        value !== "all"
      )
        return true;
      if (["startDate", "endDate"].includes(key) && value) return true;
      return false;
    }).length;
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">
            {activeTab === "posts" ? "Posts" : "Notices"} Filter
          </h3>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            showAdvanced
              ? "bg-blue-900/50 border-blue-700 text-blue-300"
              : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <Filter className="h-4 w-4 mr-1 inline" />
          Advanced
          {getActiveFilterCount() > 0 && (
            <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* User Type Filter */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={filters.userType || "all"}
            onChange={(e) => handleFilterChange("userType", e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Users</option>
            <option value="TEACHER">Teachers</option>
            <option value="STUDENT">Students</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>

        {/* Department Filter */}
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={filters.department || "all"}
            onChange={(e) => handleFilterChange("department", e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.departmentid} value={dept.departmentid}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-700 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date Range
              </label>
              <select
                value={filters.dateRange || "all"}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Custom Date Range */}
            {filters.dateRange === "custom" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate || ""}
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate || ""}
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm font-medium text-gray-300">
              Active Filters:
            </span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value || value === "all" || value === "") return null;

              let filterLabel = "";
              switch (key) {
                case "search":
                  filterLabel = `Search: "${value}"`;
                  break;
                case "userType":
                  filterLabel = `User: ${value}`;
                  break;
                case "department": {
                  const dept = departments.find((d) => d.departmentid == value);
                  filterLabel = `Department: ${dept ? dept.name : value}`;
                  break;
                }
                case "dateRange":
                  filterLabel = `Date: ${value}`;
                  break;
                default:
                  if (key === "startDate" || key === "endDate") {
                    filterLabel = `${key}: ${value}`;
                  }
              }

              if (!filterLabel) return null;

              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full"
                >
                  {filterLabel}
                  <button
                    onClick={() =>
                      handleFilterChange(key, key === "search" ? "" : "all")
                    }
                    className="ml-2 hover:text-blue-200"
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

ContentFilters.propTypes = {
  filters: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  departments: PropTypes.array,
  activeTab: PropTypes.string,
};

export default ContentFilters;
