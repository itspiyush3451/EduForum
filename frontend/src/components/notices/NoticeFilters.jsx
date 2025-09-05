import PropTypes from "prop-types";
import { FaSearch, FaFilter, FaSort } from "react-icons/fa";

const NoticeFilters = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  sortBy,
  setSortBy,
  isDarkMode,
}) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <FaSearch
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
            isDarkMode ? "text-gray-400" : "text-gray-400"
          }`}
        />
        <input
          type="text"
          placeholder="Search notices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
          } focus:outline-none focus:ring-2`}
        />
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Filter */}
        <div className="flex items-center space-x-3">
          <FaFilter
            className={`h-5 w-5 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="all">All Notices</option>
            <option value="important">Important Only</option>
            <option value="regular">Regular Only</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-3">
          <FaSort
            className={`h-5 w-5 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
};

NoticeFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filterType: PropTypes.string.isRequired,
  setFilterType: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default NoticeFilters;
