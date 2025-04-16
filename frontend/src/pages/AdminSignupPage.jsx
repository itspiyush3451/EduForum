import React from "react";
import Footer from "../components/layout/Footer";
import AdminProtectionWrapper from "../components/auth/AdminProtectionWrapper";

const AdminSignupPage = () => {
  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-800">
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <AdminProtectionWrapper />
      </div>
      <Footer />
    </div>
  );
};

export default AdminSignupPage;
