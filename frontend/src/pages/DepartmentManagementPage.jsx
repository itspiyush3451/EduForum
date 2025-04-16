import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DepartmentList from "../components/department/DepartmentList";
import CreateDepartmentModal from "../components/department/CreateDepartmentModal";

/**
 * Page component for department management
 */
const DepartmentManagementPage = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const departmentListRef = useRef(null);

  const handleDepartmentCreated = () => {
    setIsCreateModalOpen(false);
    // Trigger refresh in the DepartmentList component
    if (departmentListRef.current) {
      departmentListRef.current.refreshDepartments();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Department Management
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Department
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <DepartmentList ref={departmentListRef} />
      </div>

      {isCreateModalOpen && (
        <CreateDepartmentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onDepartmentCreated={handleDepartmentCreated}
        />
      )}
    </div>
  );
};

export default DepartmentManagementPage;
