import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
  FaHome,
  FaUsers,
  FaBook,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCog,
} from "react-icons/fa";

const AdminSidebarComponent = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const menuItems = [
    { path: "/admin/dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/admin/users", icon: <FaUsers />, label: "Users" },
    { path: "/admin/courses", icon: <FaBook />, label: "Courses" },
    { path: "/admin/departments", icon: <FaGraduationCap />, label: "Departments" },
    { path: "/admin/faculty", icon: <FaChalkboardTeacher />, label: "Faculty" },
    { path: "/admin/students", icon: <FaUserGraduate />, label: "Students" },
    { path: "/admin/settings", icon: <FaCog />, label: "Settings" },
  ];

  return (
    <aside className={`fixed top-0 left-0 w-64 h-screen ${
      isDarkMode 
        ? 'bg-gray-900 border-r border-gray-700' 
        : 'bg-white border-r border-gray-200'
    } shadow-lg`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`p-4 ${
          isDarkMode 
            ? 'bg-gray-800 border-b border-gray-700' 
            : 'bg-gray-50 border-b border-gray-200'
        }`}>
          <h1 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Admin Panel
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebarComponent; 