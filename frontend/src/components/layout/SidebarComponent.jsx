import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { 
  Home, 
  FileText, 
  PenTool, 
  Bell, 
  PlusCircle, 
  Settings, 
  HelpCircle,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

const SidebarComponent = ({ onCollapse }) => {
  const { user, isTeacher } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapse(newState);
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-72";

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'} h-full ${sidebarWidth} fixed top-16 left-0 transition-all duration-300 z-10 shadow-xl flex flex-col`}>
      {/* Fixed Top Section */}
      <div className="flex-none">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`w-full p-4 flex items-center justify-center ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-800'
          } transition-colors duration-200 border-b border-gray-700`}
        >
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>

        {/* Dashboard Section */}
        <div className="p-4">
          {!isCollapsed && (
            <div className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Dashboard
            </div>
          )}
          <Link
            to="/dashboard"
            className={`flex items-center p-4 rounded-xl ${
              isActive("/dashboard") 
                ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-800')
            } transition-all duration-200`}
          >
            <Home size={24} className={isCollapsed ? "" : "mr-4"} />
            {!isCollapsed && <span className="text-lg font-medium">Dashboard</span>}
          </Link>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <div className="space-y-2 p-4">
          {/* Posts Section */}
          {!isCollapsed && (
            <div className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Posts
            </div>
          )}
          <Link
            to="/posts/all"
            className={`flex items-center p-4 rounded-xl ${
              isActive("/posts/all") 
                ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-800')
            } transition-all duration-200`}
          >
            <FileText size={24} className={isCollapsed ? "" : "mr-4"} />
            {!isCollapsed && <span className="text-lg font-medium">All Posts</span>}
          </Link>

          <Link
            to="/posts/my-posts"
            className={`flex items-center p-4 rounded-xl ${
              isActive("/posts/user") 
                ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-800')
            } transition-all duration-200`}
          >
            <PenTool size={24} className={isCollapsed ? "" : "mr-4"} />
            {!isCollapsed && <span className="text-lg font-medium">My Posts</span>}
          </Link>

          <div className="border-t border-gray-700 my-3"></div>

          {/* Notices Section */}
          {!isCollapsed && (
            <div className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Notices
            </div>
          )}
          <Link
            to="/notices"
            className={`flex items-center p-4 rounded-xl ${
              isActive("/notices") 
                ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-800')
            } transition-all duration-200`}
          >
            <Bell size={24} className={isCollapsed ? "" : "mr-4"} />
            {!isCollapsed && <span className="text-lg font-medium">All Notices</span>}
          </Link>

          {isTeacher() && (
            <Link
              to="/notices/create"
              className={`flex items-center p-4 rounded-xl ${
                isActive("/notices/create") 
                  ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                  : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-800')
              } transition-all duration-200`}
            >
              <PlusCircle size={24} className={isCollapsed ? "" : "mr-4"} />
              {!isCollapsed && <span className="text-lg font-medium">Create Notice</span>}
            </Link>
          )}

          <div className="border-t border-gray-700 my-3"></div>

          {/* Settings Section */}
          {!isCollapsed && (
            <div className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Settings
            </div>
          )}
          <Link
            to="/settings"
            className={`flex items-center p-4 rounded-xl ${
              isActive("/settings") 
                ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-800')
            } transition-all duration-200`}
          >
            <Settings size={24} className={isCollapsed ? "" : "mr-4"} />
            {!isCollapsed && <span className="text-lg font-medium">Settings</span>}
          </Link>

          <div className="border-t border-gray-700 my-3"></div>

          {/* FAQ Section */}
          {!isCollapsed && (
            <div className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Help
            </div>
          )}
          <Link
            to="/faq"
            className={`flex items-center p-4 rounded-xl ${
              isActive("/faq") 
                ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-800')
            } transition-all duration-200`}
          >
            <HelpCircle size={24} className={isCollapsed ? "" : "mr-4"} />
            {!isCollapsed && <span className="text-lg font-medium">FAQ</span>}
          </Link>
        </div>
      </div>

      {/* Fixed Bottom Section */}
      {user && (
        <div className={`flex-none p-4 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-800'
        } border-t border-gray-700`}>
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full ${
              isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
            } flex items-center justify-center mr-3 text-white text-xl font-bold shadow-lg`}>
              {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="text-lg font-semibold">{user.username || "User"}</div>
                <div className="text-sm text-gray-400">{isTeacher() ? "Teacher" : "Student"}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarComponent;