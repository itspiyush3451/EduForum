import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { departmentService } from '../services/departmentService';

// Create the context
const DepartmentContext = createContext();

// Custom hook for using the department context
export const useDepartment = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartment must be used within a DepartmentProvider');
  }
  return context;
};

// Provider component
export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all departments
  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get department by ID
  const getDepartmentById = useCallback(async (departmentId) => {
    try {
      const response = await departmentService.getDepartmentById(departmentId);
      return response;
    } catch (err) {
      console.error('Error fetching department:', err);
      throw err;
    }
  }, []);

  // Context value
  const value = {
    departments,
    loading,
    error,
    fetchDepartments,
    getDepartmentById,
  };

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
};

DepartmentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DepartmentContext;
