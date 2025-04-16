import React, { useState } from "react";
import Footer from "../components/layout/Footer";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    usertype: "STUDENT", // Default value
    departmentid: "", // Optional
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for API - exclude confirmPassword and pass only what API needs
      const apiData = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        usertype: formData.usertype,
      };

      // Only add departmentid if it's not empty
      if (formData.departmentid) {
        apiData.departmentid = parseInt(formData.departmentid);
      }

      // Send POST request to backend endpoint for signup
      const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const responseJson = await response.json();

      if (responseJson.success) {
        navigate("/login?signupSuccess=true");
      } else {
        setErrorMessage(
          responseJson.message || "Signup failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mock departments for dropdown (in a real app, these would come from an API)
  const departments = [
    { id: 1, name: "Computer Science" },
    { id: 2, name: "Mathematics" },
    { id: 3, name: "Physics" },
    { id: 4, name: "Chemistry" },
    { id: 5, name: "Engineering" },
  ];

  return (
    <div className="flex font-poppins items-center justify-center h-screen bg-gray-800">
      <div className="container mx-auto">
        {errorMessage && (
          <div className="max-w-md mx-auto mb-2">
            <p className="text-red-500 p-3 bg-red-100 rounded-lg">
              {errorMessage}
            </p>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto p-6 bg-gray-700 drop-shadow-md rounded-lg"
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
              className="shadow text-sm border-none rounded-lg w-full mt-2 py-2 px-3 text-white-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-600"
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
              className="shadow text-sm border-none rounded-lg w-full mt-2 py-2 px-3 text-white-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-600"
              placeholder="Enter username"
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
              className="shadow text-sm border-none rounded-lg w-full mt-2 py-2 px-3 text-white-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-600"
              placeholder="Enter password"
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
              className="shadow text-sm border-none mt-2 rounded-lg w-full py-2 px-3 text-white-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-600"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="usertype"
              className="block text-sm font-medium text-white-100"
            >
              User Type
            </label>
            <select
              id="usertype"
              className="shadow text-sm border-none rounded-lg w-full mt-2 py-2 px-3 text-white-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-600"
              value={formData.usertype}
              onChange={handleChange}
              required
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="departmentid"
              className="block text-sm font-medium text-white-100"
            >
              Department (Optional)
            </label>
            <select
              id="departmentid"
              className="shadow text-sm border-none rounded-lg w-full mt-2 py-2 px-3 text-white-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-600"
              value={formData.departmentid}
              onChange={handleChange}
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 rounded-md bg-blue-500 text-white-100 font-semibold hover:bg-blue-600 focus:outline-none focus:bg-blue-600 disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="mt-4 text-sm text-white-100 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 underline">
              Log in here
            </a>
          </p>
        </form>
        <p className="text-center text-gray-500 text-xs">
          <Footer />
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
