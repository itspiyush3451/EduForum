import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const Input = forwardRef(
  (
    {
      label,
      id,
      name,
      type = "text",
      placeholder = "",
      value,
      onChange,
      onBlur,
      error,
      required = false,
      disabled = false,
      className = "",
      helpText,
      size = "md",
      fullWidth = true,
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    // Generate an id if not provided
    const inputId =
      id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Size classes
    const sizeClasses = {
      sm: "py-1 px-2 text-sm",
      md: "py-2 px-3 text-base",
      lg: "py-2.5 px-4 text-lg",
    };

    // Width class
    const widthClass = fullWidth ? "w-full" : "";

    // Base input style
    const inputBaseStyle = `
      rounded-md border transition-colors duration-200
      ${
        error
          ? "border-error-500 focus:ring-error-300 focus:border-error-500"
          : "border-gray-300 focus:ring-blue-400 focus:border-blue-500 dark:border-gray-600"
      } 
      focus:outline-none focus:ring-1 
      ${
        disabled
          ? "bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
          : "bg-white dark:bg-gray-800 dark:text-white"
      } 
      ${sizeClasses[size]}
      ${widthClass}
      ${startIcon ? "pl-10" : ""}
      ${endIcon ? "pr-10" : ""}
      ${className}
    `;

    return (
      <div className={`mb-4 ${widthClass}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
          >
            {label} {required && <span className="text-error-500">*</span>}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
              {startIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            className={inputBaseStyle}
            {...props}
          />

          {endIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
              {endIcon}
            </div>
          )}
        </div>

        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
        )}

        {error && <p className="mt-1 text-sm text-error-500">{error}</p>}
      </div>
    );
  }
);

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  helpText: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
};

Input.displayName = "Input";

export default Input;