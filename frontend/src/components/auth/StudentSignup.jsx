import React from "react";
import { Link } from "react-router-dom";
import SignupForm from "./SignupForm";

const StudentSignup = () => {
  return (
    <div className="max-w-md mx-auto">
      {/* <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Student Registration</h1>
        <p className="text-gray-600 mt-2">
          Create a new student account to access the learning platform
        </p>
      </div> */}

      <SignupForm userRole="STUDENT" />

      <div className="mt-6 text-center ">
        <p className="text-sm text-white-100">
          Are you a teacher?{" "}
          <Link to="/signup/teacher" className="text-blue-300 hover:text-blue-200 font-medium">
            Register as teacher
          </Link>
        </p>
        <p className="mt-2 text-sm text-white-100">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-300 hover:text-blue-200 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentSignup;
