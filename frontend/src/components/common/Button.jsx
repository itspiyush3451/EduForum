import React from "react";
import PropTypes from "prop-types";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  className = "",
  ...props
}) => {
  // Base styling - enhanced for consistency
  const baseStyle =
    "rounded font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";

  // Variant styling - updated with theme colors
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    success: "bg-success-500 text-white hover:bg-success-500/90 focus:ring-success-300 dark:bg-success-500 dark:hover:bg-success-500/80",
    danger: "bg-error-500 text-white hover:bg-error-500/90 focus:ring-error-300 dark:bg-error-500 dark:hover:bg-error-500/80",
    warning: "bg-warning-500 text-white hover:bg-warning-500/90 focus:ring-warning-300 dark:bg-warning-500 dark:hover:bg-warning-500/80",
    outline: "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-400 dark:text-blue-300 dark:border-blue-400 dark:hover:bg-blue-900/30",
    link: "bg-transparent text-blue-500 hover:underline p-0 focus:ring-0 dark:text-blue-300",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300 dark:text-gray-300 dark:hover:bg-gray-800"
  };

  // Responsive size styling
  const sizeStyles = {
    xs: "py-1 px-2 text-xs",
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-2.5 px-5 text-lg",
    xl: "py-3 px-6 text-xl"
  };

  // Width styling
  const widthStyle = fullWidth ? "w-full" : "";

  // Disabled styling with improved visuals
  const disabledStyle =
    disabled || isLoading
      ? "opacity-60 cursor-not-allowed"
      : "cursor-pointer shadow-sm hover:shadow";

  // Combine all styles
  const buttonStyle = `
    ${baseStyle} 
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${widthStyle} 
    ${disabledStyle} 
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={buttonStyle}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "outline",
    "link",
    "ghost"
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  fullWidth: PropTypes.bool,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;