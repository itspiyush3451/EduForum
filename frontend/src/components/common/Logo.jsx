import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import logoLight from '../../assets/logo.svg';
import logoDark from '../../assets/logo-dark.svg';

const Logo = ({ 
  className = '', 
  size = 'default',
  variant = 'default', // 'default' or 'icon-only'
  onClick = null
}) => {
  const { isDarkMode } = useTheme();
  
  // Select the appropriate logo based on theme
  const logoSrc = isDarkMode ? logoDark : logoLight;
  
  const sizeClasses = {
    small: 'w-32 h-8',
    default: 'w-40 h-10',
    large: 'w-48 h-12'
  };

  const variantClasses = {
    default: '',
    'icon-only': 'w-10 h-10' // For icon-only version
  };

  // Apply appropriate size classes based on variant and size prop
  const appliedClasses = variant === 'icon-only' 
    ? variantClasses['icon-only'] 
    : sizeClasses[size];

  return (
    <img
      src={logoSrc}
      alt="EduForum Logo"
      className={`${appliedClasses} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
};

export default Logo;