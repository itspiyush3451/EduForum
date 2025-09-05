import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isDarkMode } = useTheme();

  return (
    <footer
      className={`py-4 w-full transition-colors duration-300 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <div
            className={`text-center text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            © {currentYear} EduForum. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
