import React from "react";
import Footer from "../components/layout/Footer";
import AdminProtectionWrapper from "../components/auth/AdminProtectionWrapper";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const AdminSignupPage = () => {
  const { loading } = useAuth();

  return (
    <div className="bg-primary font-poppins min-h-screen flex flex-col">
      {/* Subtle background animation */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-purple-900/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-700/10 blur-3xl" />
      </div>

      {/* Main content with two column layout */}
      <div className="flex-1 flex relative z-10">
        {/* Left column with illustration */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 bg-purple-900/10 relative overflow-hidden"
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
              {/* Admin-themed SVG illustration */}
              <svg
                viewBox="0 0 600 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto drop-shadow-lg"
              >
                {/* Background elements */}
                <circle cx="300" cy="250" r="200" fill="#4B2C8A" fillOpacity="0.1" />
                <circle cx="300" cy="250" r="150" fill="#7E59AD" fillOpacity="0.15" />
                
                {/* Admin dashboard */}
                <rect x="150" y="150" width="300" height="200" fill="#262D34" stroke="#7E59AD" strokeWidth="2" />
                
                {/* Admin screen */}
                <rect x="170" y="170" width="260" height="120" fill="#1E252B" stroke="#9D7AC8" strokeWidth="2" />
                
                {/* Admin interface elements */}
                <rect x="190" y="190" width="60" height="10" rx="2" fill="#9D7AC8" fillOpacity="0.7" />
                <rect x="190" y="210" width="40" height="10" rx="2" fill="#9D7AC8" fillOpacity="0.7" />
                <rect x="190" y="230" width="50" height="10" rx="2" fill="#9D7AC8" fillOpacity="0.7" />
                
                {/* Admin data visualization */}
                <rect x="270" y="190" width="140" height="70" rx="2" fill="#1A1E24" stroke="#9D7AC8" strokeWidth="1" />
                
                {/* Bar chart */}
                <rect x="280" y="240" width="10" height="10" fill="#9D7AC8" />
                <rect x="300" y="230" width="10" height="20" fill="#7E59AD" />
                <rect x="320" y="210" width="10" height="40" fill="#5E3A9F" />
                <rect x="340" y="225" width="10" height="25" fill="#7E59AD" />
                <rect x="360" y="220" width="10" height="30" fill="#9D7AC8" />
                <rect x="380" y="200" width="10" height="50" fill="#5E3A9F" />
                
                {/* Chart labels */}
                <text x="285" y="260" fill="#A7C3E1" fontSize="6">M</text>
                <text x="305" y="260" fill="#A7C3E1" fontSize="6">T</text>
                <text x="325" y="260" fill="#A7C3E1" fontSize="6">W</text>
                <text x="345" y="260" fill="#A7C3E1" fontSize="6">T</text>
                <text x="365" y="260" fill="#A7C3E1" fontSize="6">F</text>
                <text x="385" y="260" fill="#A7C3E1" fontSize="6">S</text>
                
                {/* Admin desk */}
                <rect x="250" y="310" width="100" height="20" fill="#4B2C8A" stroke="#7E59AD" strokeWidth="1" />
                <rect x="260" y="330" width="80" height="20" fill="#3A1F7A" stroke="#7E59AD" strokeWidth="1" />
                
                {/* Admin figure */}
                <circle cx="300" cy="270" r="25" fill="#2C353D" stroke="#B99FD7" strokeWidth="2" />
                <rect x="290" y="295" width="20" height="30" fill="#4B2C8A" stroke="#B99FD7" strokeWidth="1" />
                
                {/* Admin glasses */}
                <ellipse cx="290" cy="270" rx="8" ry="5" stroke="#9D7AC8" strokeWidth="1" />
                <ellipse cx="310" cy="270" rx="8" ry="5" stroke="#9D7AC8" strokeWidth="1" />
                <path d="M298 270 L302 270" stroke="#9D7AC8" strokeWidth="1" />
                
                {/* Admin pointing at screen */}
                <path d="M320 280 L370 220" stroke="#B99FD7" strokeWidth="1.5" />
                
                {/* Server racks */}
                <rect x="180" y="350" width="40" height="20" fill="#1E252B" stroke="#7E59AD" strokeWidth="1" />
                <rect x="180" y="330" width="40" height="20" fill="#1E252B" stroke="#7E59AD" strokeWidth="1" />
                <rect x="180" y="310" width="40" height="20" fill="#1E252B" stroke="#7E59AD" strokeWidth="1" />
                
                {/* Server lights */}
                <circle cx="190" cy="320" r="2" fill="#5E3A9F" />
                <circle cx="190" cy="340" r="2" fill="#7E59AD" />
                <circle cx="190" cy="360" r="2" fill="#9D7AC8" />
                
                {/* Monitor stack */}
                <rect x="370" y="350" width="50" height="20" fill="#1E252B" stroke="#7E59AD" strokeWidth="1" />
                <rect x="380" y="330" width="30" height="20" fill="#1E252B" stroke="#7E59AD" strokeWidth="1" />
                
                {/* Security icons */}
                <circle cx="395" cy="340" r="5" fill="#7E59AD" />
                <path d="M395 335 L395 345" stroke="#B99FD7" strokeWidth="1" />
                <path d="M390 340 L400 340" stroke="#B99FD7" strokeWidth="1" />
                
                {/* Coffee mug */}
                <rect x="400" y="300" width="20" height="15" rx="2" fill="#4B2C8A" stroke="#9D7AC8" strokeWidth="1" />
                <path d="M420 305 C425 305, 425 310, 420 310" stroke="#9D7AC8" strokeWidth="1" />
                <path d="M410 300 C410 298, 410 296, 410 293" stroke="#B99FD7" strokeWidth="1" opacity="0.6" />
                
                {/* Admin controls */}
                <rect x="170" y="250" width="15" height="20" rx="2" fill="#4B2C8A" />
                <rect x="174" y="255" width="7" height="2" fill="#B99FD7" />
                <rect x="174" y="260" width="7" height="2" fill="#B99FD7" />
                <rect x="174" y="265" width="7" height="2" fill="#B99FD7" />
                
                {/* Title text */}
                <text
                  x="270"
                  y="420"
                  fontSize="24"
                  fontWeight="bold"
                  fill="#F7F7F7"
                  textAnchor="middle"
                >
                  Edu
                </text>
                <text
                  x="330"
                  y="420"
                  fontSize="24"
                  fontWeight="bold"
                  fill="#9D7AC8"
                  textAnchor="middle"
                >
                  Forum
                </text>
              </svg>

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <h2 className="text-purple-200 text-xl font-bold drop-shadow-md">
                  Manage and Oversee
                </h2>
                <p className="text-white-100 text-sm mt-2 opacity-80">
                  Create your admin account to manage the educational platform
                </p>
              </div>
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
                  <h1 className="text-3xl font-bold text-gradient mt-6">
                    Admin Registration
                  </h1>
                  <p className="text-gray-400 mt-2">Create your administrator account to manage the platform</p>
                </motion.div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <AdminProtectionWrapper />
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

export default AdminSignupPage;