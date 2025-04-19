import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMenu}
          className={`p-2 rounded-md ${isDarkMode ? 'text-white' : 'text-gray-700'} hover:bg-gray-700 hover:text-white focus:outline-none`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Logo variant="icon-only" size="small" className="ml-4" />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-4">
        <Link
          to="/"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            location.pathname === '/'
              ? isDarkMode
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-900'
              : isDarkMode
              ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          Home
        </Link>
        <Link
          to="/discussions"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            location.pathname === '/discussions'
              ? isDarkMode
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-900'
              : isDarkMode
              ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          Discussions
        </Link>
        {user && (
          <Link
            to="/profile"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              location.pathname === '/profile'
                ? isDarkMode
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-900'
                : isDarkMode
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            Profile
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/'
                  ? isDarkMode
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-900'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/discussions"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/discussions'
                  ? isDarkMode
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-900'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Discussions
            </Link>
            {user && (
              <Link
                to="/profile"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/profile'
                    ? isDarkMode
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Profile
              </Link>
            )}
          </div>
        </div>
      )}

      {/* User Menu */}
      <div className="flex items-center">
        {user ? (
          <button
            onClick={logout}
            className={`ml-4 px-4 py-2 rounded-md text-sm font-medium ${
              isDarkMode
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className={`ml-4 px-4 py-2 rounded-md text-sm font-medium ${
              isDarkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 