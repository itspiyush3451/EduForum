import React, { useState } from "react";
import Footer from "../components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

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
  const { loading, setLoading } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setLoading(false);
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
      setLoading(false);
    }
  };

 
  return (
    <div className="bg-primary font-poppins min-h-screen flex flex-col">
      {/* Subtle background animation */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-900/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-700/10 blur-3xl" />
      </div>

      {/* Main content with two column layout */}
      <div className="flex-1 flex relative z-10">
        {/* Left column with illustration - hidden on mobile */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 bg-blue-900/10 relative overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <motion.div
              className="relative w-full max-w-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {/* SVG illustration */}
              <svg
                viewBox="0 0 600 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto drop-shadow-lg"
              >
                {/* Background shapes */}
                <circle
                  cx="300"
                  cy="250"
                  r="200"
                  fill="#074A7E"
                  fillOpacity="0.1"
                />
                <circle
                  cx="300"
                  cy="250"
                  r="150"
                  fill="#3278B6"
                  fillOpacity="0.15"
                />

                {/* Form/Document shapes */}
                <path
                  d="M200 150 H400 A10 10 0 0 1 410 160 V340 A10 10 0 0 1 400 350 H200 A10 10 0 0 1 190 340 V160 A10 10 0 0 1 200 150 Z"
                  fill="#262D34"
                  stroke="#3278B6"
                  strokeWidth="2"
                />

                {/* Form fields */}
                <rect
                  x="210"
                  y="170"
                  width="180"
                  height="25"
                  rx="4"
                  fill="#2C353D"
                  stroke="#5A94C8"
                  strokeWidth="1"
                />
                <rect
                  x="210"
                  y="205"
                  width="180"
                  height="25"
                  rx="4"
                  fill="#2C353D"
                  stroke="#5A94C8"
                  strokeWidth="1"
                />
                <rect
                  x="210"
                  y="240"
                  width="180"
                  height="25"
                  rx="4"
                  fill="#2C353D"
                  stroke="#5A94C8"
                  strokeWidth="1"
                />
                <rect
                  x="210"
                  y="275"
                  width="180"
                  height="25"
                  rx="4"
                  fill="#2C353D"
                  stroke="#5A94C8"
                  strokeWidth="1"
                />

                {/* Submit button */}
                <rect
                  x="210"
                  y="310"
                  width="180"
                  height="30"
                  rx="4"
                  fill="#094F8E"
                />

                {/* People */}
                <circle
                  cx="120"
                  cy="180"
                  r="35"
                  fill="#2C353D"
                  stroke="#A7C3E1"
                  strokeWidth="2"
                />
                <rect
                  x="100"
                  y="225"
                  width="40"
                  height="5"
                  rx="2.5"
                  fill="#A7C3E1"
                />
                <rect
                  x="110"
                  y="235"
                  width="20"
                  height="5"
                  rx="2.5"
                  fill="#A7C3E1"
                />

                <circle
                  cx="480"
                  cy="200"
                  r="35"
                  fill="#2C353D"
                  stroke="#A7C3E1"
                  strokeWidth="2"
                />
                <rect
                  x="460"
                  y="245"
                  width="40"
                  height="5"
                  rx="2.5"
                  fill="#A7C3E1"
                />
                <rect
                  x="470"
                  y="255"
                  width="20"
                  height="5"
                  rx="2.5"
                  fill="#A7C3E1"
                />

                <circle
                  cx="150"
                  cy="380"
                  r="30"
                  fill="#2C353D"
                  stroke="#A7C3E1"
                  strokeWidth="2"
                />
                <rect
                  x="135"
                  y="420"
                  width="30"
                  height="4"
                  rx="2"
                  fill="#A7C3E1"
                />
                <rect
                  x="140"
                  y="430"
                  width="20"
                  height="4"
                  rx="2"
                  fill="#A7C3E1"
                />

                <circle
                  cx="450"
                  cy="350"
                  r="30"
                  fill="#2C353D"
                  stroke="#A7C3E1"
                  strokeWidth="2"
                />
                <rect
                  x="435"
                  y="390"
                  width="30"
                  height="4"
                  rx="2"
                  fill="#A7C3E1"
                />
                <rect
                  x="440"
                  y="400"
                  width="20"
                  height="4"
                  rx="2"
                  fill="#A7C3E1"
                />

                {/* Connecting lines */}
                <path
                  d="M155 180 L190 180"
                  stroke="#5A94C8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M410 200 L445 200"
                  stroke="#5A94C8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M180 370 L210 340"
                  stroke="#5A94C8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M390 340 L420 350"
                  stroke="#5A94C8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Right column with signup form */}
        <div className="w-full lg:w-1/2 px-4 flex justify-center items-center">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2,
                  }}
                >
                  {/* Modified this part - keeping only the gradient text */}
                  <h1 className="text-3xl font-bold text-gradient">
                    Create Account
                  </h1>
                  <p className="text-gray-400 mt-2">Join our learning community</p>
                </motion.div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 bg-error-500/20 border border-error-500 rounded-lg"
                    >
                      <p className="text-error-300 text-sm">{errorMessage}</p>
                    </motion.div>
                  )}

                  <motion.form
                    onSubmit={handleSubmit}
                    className="bg-gray-700/60 backdrop-blur-sm rounded-xl p-6 shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white-100 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="shadow text-sm border-none rounded-lg w-full py-2.5 px-3 text-white-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-600"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-white-100 mb-1"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        className="shadow text-sm border-none rounded-lg w-full py-2.5 px-3 text-white-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-600"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-white-100 mb-1"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          className="shadow text-sm border-none rounded-lg w-full py-2.5 px-3 text-white-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-600"
                          placeholder="Create password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-white-100 mb-1"
                        >
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className="shadow text-sm border-none rounded-lg w-full py-2.5 px-3 text-white-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-600"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label
                          htmlFor="usertype"
                          className="block text-sm font-medium text-white-100 mb-1"
                        >
                          User Type
                        </label>
                        <select
                          id="usertype"
                          className="shadow text-sm border-none rounded-lg w-full py-2.5 px-3 text-white-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-600"
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
                          className="block text-sm font-medium text-white-100 mb-1"
                        >
                          Department (Optional)
                        </label>
                        <select
                          id="departmentid"
                          className="shadow text-sm border-none rounded-lg w-full py-2.5 px-3 text-white-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-600"
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
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full px-4 py-3 rounded-lg bg-blue-500 text-white-100 font-semibold hover:bg-blue-600 focus:outline-none focus:bg-blue-600 disabled:opacity-70 mt-2 transition-colors"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </div>
                      ) : (
                        "Sign Up"
                      )}
                    </motion.button>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-white-100">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-300 hover:text-blue-200 font-medium">
                          Log in here
                        </a>
                      </p>
                    </div>
                  </motion.form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <div className="text-center text-gray-500 text-xs py-4">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;