import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-4 w-full">
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <div className="text-center text-gray-500 text-sm">
            © {currentYear} EduForum. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
