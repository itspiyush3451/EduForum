import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Edit,
  Trash2,
  UserCheck,
  UserX,
  MoreHorizontal,
  Eye,
} from "lucide-react";

const BulkUserActions = ({
  selectedUsers = [],
  onBulkAction,
  onSelectAll,
  totalUsers = 0,
  allSelected = false,
}) => {
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  const bulkActions = [
    {
      id: "activate",
      label: "Activate Users",
      icon: UserCheck,
      color: "green",
    },
    {
      id: "deactivate",
      label: "Deactivate Users",
      icon: UserX,
      color: "orange",
    },
    { id: "delete", label: "Delete Users", icon: Trash2, color: "red" },
    { id: "export", label: "Export Selected", icon: Eye, color: "blue" },
  ];

  const handleBulkAction = (actionId) => {
    onBulkAction(actionId, selectedUsers);
    setShowBulkMenu(false);
  };

  if (selectedUsers.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onSelectAll}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-blue-900">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
          </div>
          <button
            onClick={() => onBulkAction("clear", [])}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear selection
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowBulkMenu(!showBulkMenu)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Bulk Actions</span>
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {showBulkMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                {bulkActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleBulkAction(action.id)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                        action.color === "red"
                          ? "text-red-600 hover:bg-red-50"
                          : action.color === "green"
                          ? "text-green-600 hover:bg-green-50"
                          : action.color === "orange"
                          ? "text-orange-600 hover:bg-orange-50"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

BulkUserActions.propTypes = {
  selectedUsers: PropTypes.array,
  onBulkAction: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  totalUsers: PropTypes.number,
  allSelected: PropTypes.bool,
};

export default BulkUserActions;
