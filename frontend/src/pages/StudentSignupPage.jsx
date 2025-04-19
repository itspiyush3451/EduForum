import React from "react";
import Footer from "../components/layout/Footer";
import StudentSignup from "../components/auth/StudentSignup";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const StudentSignupPage = () => {
  const { loading } = useAuth();

  return (
    <div className="bg-primary font-poppins min-h-screen flex flex-col">
      {/* Subtle background animation */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-900/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-700/10 blur-3xl" />
      </div>

      {/* Main content with two column layout */}
      <div className="flex-1 flex relative z-10">
        {/* Left column with illustration */}
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
              {/* Student-themed SVG illustration */}
              <svg
                viewBox="0 0 600 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto drop-shadow-lg"
              >
                {/* Background elements */}
                <circle cx="300" cy="250" r="200" fill="#074A7E" fillOpacity="0.1" />
                <circle cx="300" cy="250" r="150" fill="#3278B6" fillOpacity="0.15" />
                
                {/* Campus building */}
                <rect x="150" y="150" width="300" height="200" fill="#262D34" stroke="#3278B6" strokeWidth="2" />
                
                {/* Building windows */}
                <rect x="170" y="170" width="40" height="40" fill="#2C353D" stroke="#5A94C8" strokeWidth="1" />
                <rect x="230" y="170" width="40" height="40" fill="#2C353D" stroke="#5A94C8" strokeWidth="1" />
                <rect x="290" y="170" width="40" height="40" fill="#2C353D" stroke="#5A94C8" strokeWidth="1" />
                <rect x="350" y="170" width="40" height="40" fill="#2C353D" stroke="#5A94C8" strokeWidth="1" />
                
                <rect x="170" y="230" width="40" height="40" fill="#2C353D" stroke="#5A94C8" strokeWidth="1" />
                <rect x="230" y="230" width="40" height="40" fill="#2C353D" stroke="#5A94C8" strokeWidth="1" />
                <rect x="290" y="230" width="40" height="40" fill="#2C353D" stroke="#5A94C8" strokeWidth="1" />
                <rect x="350" y="230" width="40" height="40" fill="#2C353D" stroke="#5A94C8" strokeWidth="1" />
                
                {/* Building entrance */}
                <rect x="250" y="290" width="100" height="60" fill="#1A62A2" stroke="#3278B6" strokeWidth="2" />
                <rect x="270" y="300" width="60" height="50" fill="#2C353D" />
                
                {/* Academic cap */}
                <path d="M300 80 L350 100 L300 120 L250 100 Z" fill="#1A62A2" />
                <path d="M300 120 L350 100 L350 130 L340 135 L300 150 Z" fill="#094F8E" />
                <path d="M300 120 L250 100 L250 130 L260 135 L300 150 Z" fill="#094F8E" />
                <rect x="295" y="60" width="10" height="30" fill="#3278B6" />
                <circle cx="300" cy="55" r="10" fill="#5A94C8" />

                {/* Book stack */}
                <rect x="400" y="300" width="60" height="15" fill="#3278B6" stroke="#5A94C8" strokeWidth="1" />
                <rect x="405" y="285" width="50" height="15" fill="#094F8E" stroke="#5A94C8" strokeWidth="1" />
                <rect x="410" y="270" width="40" height="15" fill="#1A62A2" stroke="#5A94C8" strokeWidth="1" />
                
                {/* Student with laptop */}
                <circle cx="150" cy="320" r="30" fill="#2C353D" stroke="#A7C3E1" strokeWidth="2" />
                <rect x="120" y="350" width="60" height="30" fill="#1E252B" stroke="#A7C3E1" strokeWidth="1" />
                <rect x="130" y="380" width="40" height="20" fill="#1E252B" stroke="#A7C3E1" strokeWidth="1" />
                <rect x="130" y="365" width="40" height="15" fill="#3278B6" />
                
                {/* Trees/greenery */}
                <circle cx="100" cy="200" r="20" fill="#094F8E" fillOpacity="0.6" />
                <rect x="95" y="220" width="10" height="30" fill="#262D34" />
                
                <circle cx="500" cy="220" r="20" fill="#094F8E" fillOpacity="0.6" />
                <rect x="495" y="240" width="10" height="30" fill="#262D34" />
                
                {/* Student group */}
                <circle cx="450" cy="330" r="20" fill="#2C353D" stroke="#A7C3E1" strokeWidth="1.5" />
                <circle cx="480" cy="340" r="20" fill="#2C353D" stroke="#A7C3E1" strokeWidth="1.5" />
                <circle cx="465" cy="370" r="20" fill="#2C353D" stroke="#A7C3E1" strokeWidth="1.5" />
                
                {/* Cloud thought bubble */}
                <path 
                  d="M190 280 Q180 260 200 260 Q200 240 220 250 Q240 230 260 250 Q280 240 280 260 Q300 260 290 280 Q300 300 280 300 Q280 320 260 310 Q240 330 220 310 Q200 320 200 300 Q180 300 190 280 Z" 
                  fill="#2C353D" 
                  stroke="#A7C3E1" 
                  strokeWidth="1" 
                />
                
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
                  fill="#3278B6"
                  textAnchor="middle"
                >
                  Forum
                </text>
              </svg>

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <h2 className="text-blue-200 text-xl font-bold drop-shadow-md">
                  Join Your Campus Community
                </h2>
                <p className="text-white-100 text-sm mt-2 opacity-80">
                  Connect with classmates, access resources, and enhance your learning experience
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
                  {/* Modified this part - removed duplicate text, keeping only the gradient text */}
                  <h1 className="text-3xl font-bold text-gradient mt-6">
                    Student Registration
                  </h1>
                  <p className="text-gray-400 mt-2">Create your student account to get started</p>
                </motion.div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <StudentSignup />
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

export default StudentSignupPage;