import React from "react";
import PropTypes from "prop-types";

const Spinner = ({
  size = "md",
  color = "blue",
  className = "",
  fullScreen = false,
  text = "",
  backdrop = true,
}) => {
  // Size classes - enhanced for responsiveness
  const sizeMap = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-8 w-8 sm:h-10 sm:w-10",
    lg: "h-12 w-12 sm:h-16 sm:w-16",
    xl: "h-16 w-16 sm:h-20 sm:w-20",
  };

  // Color classes - updated with theme colors
  const colorMap = {
    blue: "text-blue-500 dark:text-blue-400",
    gray: "text-gray-600 dark:text-gray-300",
    green: "text-success-500 dark:text-success-300",
    red: "text-error-500 dark:text-error-300",
    yellow: "text-warning-500 dark:text-warning-300",
    white: "text-white",
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;
  const spinnerColor = colorMap[color] || colorMap.blue;

  // Responsive text sizes
  const textSizeMap = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  // Spinner SVG with smoother animation
  const spinnerSvg = (
    <svg
      className={`animate-spin ${spinnerSize} ${spinnerColor} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (fullScreen) {
    return (
      <div 
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          backdrop ? "bg-gray-900 bg-opacity-50 backdrop-blur-sm" : ""
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          {spinnerSvg}
          {text && (
            <p className={`mt-4 ${textSizeMap[size]} font-medium ${color === "white" ? "text-white" : "text-gray-800 dark:text-white"}`}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center" role="status" aria-live="polite">
      {spinnerSvg}
      {text && (
        <p className={`ml-3 ${textSizeMap[size]} font-medium ${spinnerColor.includes("text-white") ? "text-white" : ""}`}>
          {text}
        </p>
      )}
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  color: PropTypes.oneOf(["blue", "gray", "green", "red", "yellow", "white"]),
  className: PropTypes.string,
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
  backdrop: PropTypes.bool,
};

export default Spinner;