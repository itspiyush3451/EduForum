import React, { useState, useEffect, useContext, forwardRef, useImperativeHandle } from "react";
import { departmentService } from "../../services/departmentService";
import Spinner from "../common/Spinner";
import { AuthContext } from "../../context/AuthContext";
import CreateDepartmentModal from "./CreateDepartmentModal";
import EditDepartmentModal from "./EditDepartmentModal";
import DeleteDepartmentModal from "./DeleteDepartmentModal";

/**
 * Component for displaying a list of departments with admin actions
 */
const DepartmentList = forwardRef((props, ref) => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.usertype === "ADMIN";

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDepartment, setDeleteDepartment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(0);

  // Expose the refreshDepartments method to parent components
  useImperativeHandle(ref, () => ({
    refreshDepartments: () => {
      setTriggerRefresh(prev => prev + 1);
    }
  }));

  // Fetch departments on component mount and when triggerRefresh changes
  useEffect(() => {
    fetchDepartments();
  }, [triggerRefresh]);

  // Function to fetch all departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentService.getAllDepartments();
      console.log("Frontend received departments:", response);
      
      if (Array.isArray(response)) {
        setDepartments(response);
        console.log("Departments state set to:", response);
      } else {
        console.error("Unexpected departments response format:", response);
        setDepartments([]);
      }
    } catch (err) {
      setError("Failed to load departments. Please try again.");
      console.error("Error fetching departments:", err);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (department) => {
    setDeleteDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteDepartment) return;

    try {
      setIsDeleting(true);
      await departmentService.deleteDepartment(deleteDepartment.departmentid);
      setDepartments(departments.filter((dept) => dept.departmentid !== deleteDepartment.departmentid));
      setIsDeleteModalOpen(false);
      setDeleteDepartment(null);
    } catch (err) {
      setError("Failed to delete department.");
      console.error("Error deleting department:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDepartmentAdded = () => {
    setIsCreateModalOpen(false);
    setTriggerRefresh((prev) => prev + 1);
  };

  const handleDepartmentUpdated = () => {
    fetchDepartments();
    setEditDepartment(null);
    setIsEditModalOpen(false);
  };

  if (loading && departments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Department List</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departments.length > 0 ? (
                departments.map((department) => (
                  <tr key={department.departmentid}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {department.departmentid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {department.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {department.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {isAdmin && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditDepartment(department);
                              setIsEditModalOpen(true);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(department)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No departments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateModalOpen && isAdmin && (
        <CreateDepartmentModal
          onClose={() => setIsCreateModalOpen(false)}
          onDepartmentAdded={handleDepartmentAdded}
        />
      )}

      {editDepartment && isAdmin && (
        <EditDepartmentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setEditDepartment(null);
            setIsEditModalOpen(false);
          }}
          department={editDepartment}
          onDepartmentUpdated={handleDepartmentUpdated}
        />
      )}

      {deleteDepartment && isAdmin && (
        <DeleteDepartmentModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteDepartment(null);
          }}
          onConfirm={confirmDelete}
          department={deleteDepartment}
          loading={isDeleting}
        />
      )}
    </div>
  );
});

export default DepartmentList;
