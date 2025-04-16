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
}) => {
  const modalRef = useRef(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    // Clean up event listener
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
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

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  // Use portal to render the modal at the end of the document body
  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleOutsideClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all`}
      >
        {/* Modal header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 id="modal-title" className="text-lg font-medium text-gray-900">
            {title}
          </h3>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
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
        <div className="p-4 overflow-y-auto">{children}</div>

        {/* Modal footer, if provided */}
        {footer && (
          <div className="px-4 py-3 border-t bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
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
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "full"]),
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  closeOnOutsideClick: PropTypes.bool,
  showCloseButton: PropTypes.bool,
};

export default Modal;
