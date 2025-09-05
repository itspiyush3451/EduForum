import React from "react";

const TestPage = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          EduForum Test Page
        </h1>
        <p className="text-lg text-gray-600">
          If you can see this, React is working!
        </p>
        <div className="mt-8">
          <a
            href="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
