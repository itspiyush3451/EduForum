import React from "react";
import { Link } from "react-router-dom";

const SimpleLandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">EduForum</h1>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-blue-600">EduForum</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A smart academic chatbot and forum system that connects students,
            teachers, and administrators on one intelligent platform.
          </p>

          {/* Signup Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              to="/signup/student"
              className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Student</h3>
              <p>Join as a student</p>
            </Link>

            <Link
              to="/signup/teacher"
              className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Teacher</h3>
              <p>Join as a teacher</p>
            </Link>

            <Link
              to="/signup/admin"
              className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Admin</h3>
              <p>Join as an admin</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SimpleLandingPage;
