import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { departmentService } from "../../services/departmentService";
import { authService } from "../../services/authService";

const SignupForm = ({ userRole }) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    usertype: userRole || "STUDENT", // Use the provided userRole prop
    departmentid: "", // Optional
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const navigate = useNavigate();

  // Set usertype whenever userRole prop changes
  useEffect(() => {
    if (userRole) {
      setFormData((prev) => ({ ...prev, usertype: userRole }));
    }
  }, [userRole]);

  // Fetch departments when component mounts, but only if not an admin
  useEffect(() => {
    const fetchDepartments = async () => {
      // Skip fetching departments if user is an admin
      if (formData.usertype === "ADMIN") {
        return;
      }
      
      try {
        const response = await departmentService.getAllDepartments();
        console.log('Department response:', response); // Add logging
        if (Array.isArray(response)) {
          setDepartments(response);
        } else if (response && Array.isArray(response.data)) {
          setDepartments(response.data);
        } else {
          console.error("Failed to fetch departments:", response);
          setDepartments([]);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, [formData.usertype]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for API - exclude confirmPassword and pass only what API needs
      const apiData = {
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        usertype: formData.usertype.toUpperCase(),
      };

      // Always add departmentid for non-admin users
      if (formData.usertype !== "ADMIN") {
        if (!formData.departmentid) {
          setErrorMessage("Please select a department");
          setIsLoading(false);
          return;
        }
        // Ensure departmentid is a number
        apiData.departmentid = Number(formData.departmentid);
        if (isNaN(apiData.departmentid)) {
          setErrorMessage("Invalid department selected");
          setIsLoading(false);
          return;
        }
      }

      console.log("Submitting signup data:", apiData);
      const response = await authService.signup(apiData);

      // Check if we have a valid response
      if (!response) {
        throw new Error("No response received from server");
      }

      // The response might have success property or be the data directly
      if (response.success || response.token) {
        // Navigate to login page with success message
        navigate("/login?signupSuccess=true");
      } else {
        setErrorMessage(
          response.message || "Signup failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error signing up:", error);
      if (error.response?.data) {
        setErrorMessage(
          error.response.data.message || 
          error.response.data.error || 
          "An error occurred during signup. Please try again."
        );
      } else {
        setErrorMessage(error.message || "An error occurred during signup. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if we should show the department dropdown
  const showDepartmentDropdown = formData.usertype !== "ADMIN";

  return (
    <div className="max-w-md mx-auto">
      {errorMessage && (
        <div className="mb-4">
          <p className="text-red-500 p-3 bg-red-100 rounded-lg">
            {errorMessage}
          </p>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-gray-700 drop-shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 mt-4 text-center text-white-100">
          Sign Up
        </h2>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white-100"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow text-sm border-none rounded-lg w-full mt-2 py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-white"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-white-100"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            className="shadow text-sm border-none rounded-lg w-full mt-2 py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-white"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white-100"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow text-sm border-none rounded-lg w-full mt-2 py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-white"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-white-100"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="shadow text-sm border-none mt-2 rounded-lg w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-white"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Hidden input for usertype */}
        <input type="hidden" id="usertype" value={formData.usertype} />

        {/* Only show department dropdown for non-admin users */}
        {showDepartmentDropdown && (
          <div className="mb-4">
            <label
              htmlFor="departmentid"
              className="block text-sm font-medium text-white-100"
            >
              Department (Required)
            </label>
            <select
              id="departmentid"
              className="shadow text-sm border-none rounded-lg w-full mt-2 py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-white"
              value={formData.departmentid}
              onChange={handleChange}
              required
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.departmentid} value={dept.departmentid}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 rounded-md bg-blue-500 text-white-100 font-semibold hover:bg-blue-600 focus:outline-none focus:bg-blue-600 disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

SignupForm.propTypes = {
  userRole: PropTypes.string,
};

export default SignupForm;
