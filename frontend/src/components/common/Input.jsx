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
      ...props
    },
    ref
  ) => {
    // Generate an id if not provided
    const inputId =
      id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
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
          className={`
          px-3 py-2 w-full rounded-md border 
          ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          } 
          focus:outline-none focus:ring-1 
          ${
            disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-white"
          } 
          ${className}
        `}
          {...props}
        />

        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helpText}</p>
        )}

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
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
};

Input.displayName = "Input";

export default Input;
