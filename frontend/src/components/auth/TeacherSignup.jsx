import React from "react";
import { Link } from "react-router-dom";
import SignupForm from "./SignupForm";

const TeacherSignup = () => {
  return (
    <div className="max-w-md mx-auto">
      {/* <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Teacher Registration</h1>
        <p className="text-gray-600 mt-2">
          Create a new teacher account to access the teaching platform
        </p>
      </div> */}

      <SignupForm userRole="TEACHER" />

      <div className="mt-6 text-center ">
        <p className="text-sm text-white-100">
          Are you a student?{" "}
          <Link to="/signup/student" className="text-blue-300 hover:text-blue-200 font-medium">
            Register as student
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

export default TeacherSignup;
