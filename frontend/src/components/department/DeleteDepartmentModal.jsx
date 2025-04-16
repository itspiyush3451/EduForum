import React from "react";
import PropTypes from "prop-types";

/**
 * Modal component for confirming department deletion
 */
const DeleteDepartmentModal = ({ isOpen, onClose, onConfirm, department, loading }) => {
  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Confirm Department Deletion
        </h3>

        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete the department <span className="font-semibold">{department.name}</span>?
          </p>
          <p className="text-red-600 mt-2 text-sm">
            This action cannot be undone. All associated data will be permanently removed.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
          >
            {loading ? "Deleting..." : "Delete Department"}
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteDepartmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  department: PropTypes.shape({
    departmentid: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }),
  loading: PropTypes.bool,
};

export default DeleteDepartmentModal; 