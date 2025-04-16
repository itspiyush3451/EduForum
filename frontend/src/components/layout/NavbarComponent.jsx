import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const NavbarComponent = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-blue-700 shadow-lg" 
          : "bg-blue-600"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="font-bold text-xl text-white transition-transform duration-300 hover:scale-110"
                onMouseEnter={() => setHoveredItem('logo')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className={`inline-block transition-all duration-300 ${
                  hoveredItem === 'logo' ? 'transform translate-x-1' : ''
                }`}>Edu</span>
                <span className={`inline-block transition-all duration-300 ${
                  hoveredItem === 'logo' ? 'text-blue-300' : ''
                }`}>Forum</span>
              </Link>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-white hover:bg-blue-500 transition-colors mr-4"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <div className="relative ml-3">
                <div>
                  <button
                    onMouseEnter={() => setProfileDropdownOpen(true)}
                    onClick={toggleProfileDropdown}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white transition-all duration-300 hover:bg-blue-500 px-3 py-2"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center transition-all duration-300 hover:bg-blue-700 hover:shadow-md">
                      {user && user.username
                        ? user.username.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <span className="ml-2 transition-all duration-300">{user?.username || "User"}</span>
                  </button>
                </div>

                {profileDropdownOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-300 animate-fadeIn"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition-all duration-200"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition-all duration-200"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100 transition-all duration-200"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-white hover:bg-blue-500 transition-colors mr-4"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1"
                onMouseEnter={() => setHoveredItem('login')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="ml-4 px-4 py-2 text-sm font-medium text-blue-100 border border-blue-400 rounded-md hover:bg-blue-700 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1"
                onMouseEnter={() => setHoveredItem('signup')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;