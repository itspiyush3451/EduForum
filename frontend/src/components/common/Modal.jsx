import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

const Modal = ({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  footer,
  closeOnOutsideClick = true,
  showCloseButton = true,
  className = "",
  contentClassName = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
}) => {
  const modalRef = useRef(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  const handleOutsideClick = (e) => {
    if (
      closeOnOutsideClick &&
      modalRef.current &&
      !modalRef.current.contains(e.target)
    ) {
      onClose();
    }
  };

  // Size classes - more responsive
  const sizeClasses = {
    xs: "max-w-xs w-full",
    sm: "max-w-sm w-full",
    md: "max-w-lg w-full sm:w-11/12 md:w-4/5 lg:w-3/4",
    lg: "max-w-2xl w-full sm:w-11/12 md:w-4/5 lg:w-4/5",
    xl: "max-w-4xl w-full sm:w-11/12 md:w-5/6 lg:w-5/6",
    full: "w-full mx-4 sm:mx-8",
  };

  // Animation classes
  const animationClasses = "transform transition-all duration-300 ease-in-out";

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  // Use portal to render the modal at the end of the document body
  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={handleOutsideClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl ${sizeClasses[size]} ${animationClasses} ${className}`}
      >
        {/* Modal header */}
        <div className={`flex justify-between items-center p-4 border-b dark:border-gray-700 ${headerClassName}`}>
          <h3 id="modal-title" className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors"
              aria-label="Close"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Modal body */}
        <div className={`p-4 overflow-y-auto max-h-[70vh] ${bodyClassName}`}>{children}</div>

        {/* Modal footer, if provided */}
        {footer && (
          <div className={`px-4 py-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-wrap justify-end gap-2 rounded-b-lg ${footerClassName}`}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "full"]),
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  closeOnOutsideClick: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  footerClassName: PropTypes.string,
};

export default Modal;