import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const NavItem = ({ icon, path, label, badge }) => (
    <Link
      to={path}
      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 group relative
        ${isActive(path) 
          ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg" 
          : "text-gray-300 hover:bg-gray-700/70 hover:text-white"
        }
        ${hoveredItem === label ? "translate-x-1" : ""}
      `}
      onMouseEnter={() => setHoveredItem(label)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <div className={`transition-all duration-300 ${hoveredItem === label && !isActive(path) ? "text-blue-400" : ""}`}>
        {icon}
      </div>
      <span className={`transition-all duration-300 ${isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100 ml-3"}`}>
        {label}
      </span>
      {badge && (
        <span className={`absolute right-3 px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white transition-opacity ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
          {badge}
        </span>
      )}
      {isActive(path) && (
        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-300 rounded-l-md"></span>
      )}
    </Link>
  );

  // Icon components
  const DashboardIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-5 h-5 transition-transform duration-300 ${hoveredItem === "Dashboard" ? "scale-110" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );

  const UsersIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-5 h-5 transition-transform duration-300 ${hoveredItem === "Users" ? "scale-110" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );

  const DepartmentsIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-5 h-5 transition-transform duration-300 ${hoveredItem === "Departments" ? "scale-110" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );

  const SettingsIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-5 h-5 transition-transform duration-300 ${hoveredItem === "Settings" ? "scale-110" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  const ReportsIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-5 h-5 transition-transform duration-300 ${hoveredItem === "Reports" ? "scale-110" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );

  const NotificationsIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-5 h-5 transition-transform duration-300 ${hoveredItem === "Notifications" ? "scale-110" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );

  return (
    <div
      className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen ${
        isCollapsed ? "w-16" : "w-64"
      } pt-6 transition-all duration-300 ease-in-out overflow-hidden fixed left-0 top-16 z-10 shadow-xl`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className={`px-4 mb-8 ${isCollapsed ? "hidden" : "block"}`}>
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <span className="text-lg font-bold">{user?.username?.charAt(0).toUpperCase() || "A"}</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.username || "Admin"}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="space-y-1 px-2">
        <NavItem icon={<DashboardIcon />} path="/admin" label="Dashboard" />
        <NavItem icon={<UsersIcon />} path="/admin/users" label="Users" />
        <NavItem icon={<DepartmentsIcon />} path="/admin/departments" label="Departments" badge="2" />
        <NavItem icon={<SettingsIcon />} path="/admin/settings" label="Settings" />
        <NavItem icon={<ReportsIcon />} path="/admin/reports" label="Reports" />
        <NavItem icon={<NotificationsIcon />} path="/admin/notifications" label="Notifications" badge="3" />
      </div>

      {/* Sidebar Footer */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 ${isCollapsed ? "hidden" : ""}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-gray-400">System Online</span>
          </div>
          <button className="p-1 rounded hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;