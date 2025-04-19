import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { FaSun, FaMoon, FaUserCircle } from "react-icons/fa";

const AdminNavbarComponent = () => {
  const { logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className={`fixed top-0 left-64 right-0 h-16 z-50 ${
      isDarkMode 
        ? 'bg-gray-800 border-b border-gray-700' 
        : 'bg-white border-b border-gray-200'
    } shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left side - empty for now */}
          <div></div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } transition-colors duration-200`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>

            {/* User Profile */}
            <div className={`flex items-center space-x-2 p-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors duration-200`}>
              <FaUserCircle size={24} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Admin
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } transition-colors duration-200`}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbarComponent; 