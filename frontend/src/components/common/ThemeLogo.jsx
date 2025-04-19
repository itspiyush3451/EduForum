import React from 'react'; 
import { useTheme } from '../../context/ThemeContext'; 
import logo from '../../assets/EduForum_logo.png'; 


const ThemeLogo = ({ className = '', size = 'default' }) => {
  const { isDarkMode } = useTheme();
      
  const sizeClasses = {
    small: 'w-32 h-8',
    default: 'w-70 h-40',
    large: 'w-80 h-45'
  };
  
  // Make sure the logo is always visible regardless of theme
  return (
    <img
      src={logo}
      alt="EduForum Logo"
      className={`${sizeClasses[size]} ${className}`}
      style={{ 
        maxHeight: "80px",
        // Ensure visibility in both modes - add a drop shadow in light mode
        filter: !isDarkMode ? 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' : 'none',
        // Important to ensure the logo is always displayed
        display: 'block'
      }}
    />
  );
};

export default ThemeLogo;