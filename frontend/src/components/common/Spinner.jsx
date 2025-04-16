import React from "react";
import PropTypes from "prop-types";

const Spinner = ({
  size = "md",
  color = "blue",
  className = "",
  fullScreen = false,
  text = "",
}) => {
  // Size classes
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  // Color classes
  const colorMap = {
    blue: "text-blue-600",
    gray: "text-gray-600",
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-500",
    white: "text-white",
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;
  const spinnerColor = colorMap[color] || colorMap.blue;

  // Spinner SVG
  const spinnerSvg = (
    <svg
      className={`animate-spin ${spinnerSize} ${spinnerColor} ${className}`}
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
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="text-center">
          {spinnerSvg}
          {text && <p className="mt-2 text-white font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {spinnerSvg}
      {text && <p className="ml-2 font-medium">{text}</p>}
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  color: PropTypes.oneOf(["blue", "gray", "green", "red", "yellow", "white"]),
  className: PropTypes.string,
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
};

export default Spinner;
