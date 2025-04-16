import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import { departmentService } from "../../services/departmentService";
import Spinner from "../common/Spinner";
import Input from "../common/Input";
import Button from "../common/Button";

/**
 * Form component for updating user profile information
 */
const ProfileForm = () => {
  const { user, updateUserInContext } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    departmentId: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Load user data and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get profile data
        const profileData = await userService.getUserProfile();

        // Get departments using departmentService
        const departmentsData = await departmentService.getAllDepartments();

        setFormData({
          username: profileData.username || "",
          email: profileData.email || "",
          departmentId: profileData.departmentId || "",
        });

        setDepartments(departmentsData || []);
      } catch (err) {
        console.error("Error loading profile data:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError(null);

    try {
      // Update profile information
      const updatedProfile = await userService.updateUserProfile(formData);

      // Update user in auth context if needed
      if (updateUserInContext) {
        updateUserInContext(updatedProfile);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailChange = async () => {
    if (!formData.email || formData.email === user.email) return;

    setSubmitting(true);
    setSuccess(false);
    setError(null);

    try {
      await userService.changeEmail({ newEmail: formData.email });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error changing email:", err);
      setError("Failed to change email. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-6">Profile Settings</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Profile updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <div className="mt-1">
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="departmentId"
            className="block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <div className="mt-1">
            <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
