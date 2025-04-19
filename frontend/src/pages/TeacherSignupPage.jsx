import React from "react";
import Footer from "../components/layout/Footer";
import TeacherSignup from "../components/auth/TeacherSignup";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const TeacherSignupPage = () => {
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
              {/* Teacher-themed SVG illustration */}
              <svg
                viewBox="0 0 600 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto drop-shadow-lg"
              >
                {/* Background elements */}
                <circle cx="300" cy="250" r="200" fill="#074A7E" fillOpacity="0.1" />
                <circle cx="300" cy="250" r="150" fill="#3278B6" fillOpacity="0.15" />
                
                {/* Classroom setting */}
                <rect x="150" y="150" width="300" height="200" fill="#262D34" stroke="#3278B6" strokeWidth="2" />
                
                {/* Classroom board */}
                <rect x="170" y="170" width="260" height="120" fill="#1E252B" stroke="#5A94C8" strokeWidth="2" />
                
                {/* Board content - math equations */}
                <path d="M190 190 L240 190" stroke="#A7C3E1" strokeWidth="1.5" />
                <path d="M190 210 L230 210" stroke="#A7C3E1" strokeWidth="1.5" />
                <path d="M190 230 L250 230" stroke="#A7C3E1" strokeWidth="1.5" />
                
                {/* Mathematical symbols */}
                <text x="270" y="200" fill="#A7C3E1" fontSize="14">∑</text>
                <text x="290" y="200" fill="#A7C3E1" fontSize="14">∫</text>
                <text x="310" y="200" fill="#A7C3E1" fontSize="14">π</text>
                <text x="330" y="200" fill="#A7C3E1" fontSize="14">√</text>
                
                <text x="270" y="230" fill="#A7C3E1" fontSize="14">x²</text>
                <text x="290" y="230" fill="#A7C3E1" fontSize="14">y²</text>
                <text x="310" y="230" fill="#A7C3E1" fontSize="14">=</text>
                <text x="330" y="230" fill="#A7C3E1" fontSize="14">z²</text>
                
                {/* Teacher desk */}
                <rect x="250" y="310" width="100" height="20" fill="#1A62A2" stroke="#3278B6" strokeWidth="1" />
                <rect x="260" y="330" width="80" height="20" fill="#094F8E" stroke="#3278B6" strokeWidth="1" />
                
                {/* Teacher figure */}
                <circle cx="300" cy="270" r="25" fill="#2C353D" stroke="#A7C3E1" strokeWidth="2" />
                <rect x="290" y="295" width="20" height="30" fill="#1A62A2" stroke="#A7C3E1" strokeWidth="1" />
                
                {/* Teacher glasses */}
                <ellipse cx="290" cy="270" rx="8" ry="5" stroke="#5A94C8" strokeWidth="1" />
                <ellipse cx="310" cy="270" rx="8" ry="5" stroke="#5A94C8" strokeWidth="1" />
                <path d="M298 270 L302 270" stroke="#5A94C8" strokeWidth="1" />
                
                {/* Teacher pointing stick */}
                <path d="M320 280 L370 220" stroke="#A7C3E1" strokeWidth="1.5" />
                
                {/* Student desks */}
                <rect x="180" y="350" width="50" height="20" fill="#1E252B" stroke="#3278B6" strokeWidth="1" />
                <rect x="275" y="350" width="50" height="20" fill="#1E252B" stroke="#3278B6" strokeWidth="1" />
                <rect x="370" y="350" width="50" height="20" fill="#1E252B" stroke="#3278B6" strokeWidth="1" />
                
                {/* Student figures (simplified) */}
                <circle cx="205" cy="335" r="10" fill="#2C353D" stroke="#A7C3E1" strokeWidth="1" />
                <circle cx="300" cy="335" r="10" fill="#2C353D" stroke="#A7C3E1" strokeWidth="1" />
                <circle cx="395" cy="335" r="10" fill="#2C353D" stroke="#A7C3E1" strokeWidth="1" />
                
                {/* Books stack */}
                <rect x="420" y="300" width="40" height="8" fill="#3278B6" stroke="#5A94C8" strokeWidth="1" />
                <rect x="425" y="292" width="30" height="8" fill="#094F8E" stroke="#5A94C8" strokeWidth="1" />
                <rect x="430" y="284" width="20" height="8" fill="#1A62A2" stroke="#5A94C8" strokeWidth="1" />
                
                {/* Apple for teacher */}
                <circle cx="150" cy="300" r="15" fill="#3278B6" />
                <path d="M150 285 L150 275 C155 275 155 280 150 280" stroke="#A7C3E1" strokeWidth="1.5" />
                
                {/* Educational icons */}
                <rect x="170" y="250" width="15" height="20" fill="#1A62A2" />
                <circle cx="400" cy="200" r="10" fill="#1A62A2" />
                <path d="M395 210 L405 220" stroke="#A7C3E1" strokeWidth="1.5" />
                <path d="M405 210 L395 220" stroke="#A7C3E1" strokeWidth="1.5" />
                
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
                  Inspire and Connect
                </h2>
                <p className="text-white-100 text-sm mt-2 opacity-80">
                  Join our community of educators to share knowledge and enhance student learning
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
                    Teacher Registration
                  </h1>
                  <p className="text-gray-400 mt-2">Create your educator account to start mentoring</p>
                </motion.div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <TeacherSignup />
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

export default TeacherSignupPage;