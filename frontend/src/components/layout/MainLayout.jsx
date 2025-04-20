import React, { useState } from 'react';
import { Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import NavbarComponent from "../layout/NavbarComponent";
import SidebarComponent from "../layout/SidebarComponent";
import Footer from "../layout/Footer";

const MainLayout = () => {
  const { loading, isAuthenticated } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Don't show footer on dashboard
  const showFooter = !location.pathname.includes('/dashboard');

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <NavbarComponent />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        <SidebarComponent onCollapse={setIsSidebarCollapsed} />
        <main className={`flex-1 p-4 transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-72'
        }`}>
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;