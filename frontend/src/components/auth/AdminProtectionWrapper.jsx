import React, { useState } from "react";
import AdminSignup from "./AdminSignup";
import { Link } from "react-router-dom";

const AdminProtectionWrapper = () => {
  const [accessCode, setAccessCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  // In a real app, this would be an environment variable or from your backend
  const ADMIN_SIGNUP_CODE = "piyushharsh";

  const handleVerify = (e) => {
    e.preventDefault();
    if (accessCode === ADMIN_SIGNUP_CODE) {
      setIsVerified(true);
      setError("");
    } else {
      setError(
        "Invalid access code. Please contact your system administrator."
      );
    }
  };

  if (isVerified) {
    return <AdminSignup />;
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Admin Registration</h1>
        <p className="text-gray-600 mt-2">
          Enter the admin access code to continue
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label
            htmlFor="accessCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Access Code
          </label>
          <input
            type="password"
            id="accessCode"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Verify & Continue
        </button>

        <div className="text-center text-sm text-gray-600 mt-4">
          <Link to="/signup/student" className="text-blue-600 hover:underline">
            Back to Student Registration
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminProtectionWrapper;
