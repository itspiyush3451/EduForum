// LoginPage.jsx
import React from "react";
import Footer from "../components/layout/Footer";
import EnhancedLoginForm from "../components/auth/LoginForm";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
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
              {/* SVG illustration */}
              <svg
                viewBox="0 0 600 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto drop-shadow-lg"
              >
                {/* Background shapes */}
                <circle
                  cx="300"
                  cy="250"
                  r="200"
                  fill="#094F8E"
                  fillOpacity="0.1"
                />
                <circle
                  cx="300"
                  cy="250"
                  r="150"
                  fill="#1A62A2"
                  fillOpacity="0.15"
                />

                {/* EdufLogo */}
                <path
                  d="M200 150 H400 A10 10 0 0 1 410 160 V340 A10 10 0 0 1 400 350 H200 A10 10 0 0 1 190 340 V160 A10 10 0 0 1 200 150 Z"
                  fill="#262D34"
                  stroke="#3278B6"
                  strokeWidth="2"
                />

                {/* Decorative elements */}
                <rect
                  x="210"
                  y="180"
                  width="180"
                  height="20"
                  rx="4"
                  fill="#3278B6"
                  fillOpacity="0.7"
                />
                <rect
                  x="210"
                  y="210"
                  width="150"
                  height="8"
                  rx="4"
                  fill="#5A94C8"
                  fillOpacity="0.6"
                />
                <rect
                  x="210"
                  y="230"
                  width="130"
                  height="8"
                  rx="4"
                  fill="#5A94C8"
                  fillOpacity="0.6"
                />

                {/* Chat bubbles */}
                <circle cx="230" cy="280" r="20" fill="#094F8E" />
                <rect
                  x="260"
                  y="265"
                  width="100"
                  height="30"
                  rx="15"
                  fill="#1A62A2"
                />

                <circle cx="230" cy="330" r="20" fill="#3278B6" />
                <rect
                  x="260"
                  y="315"
                  width="120"
                  height="30"
                  rx="15"
                  fill="#5A94C8"
                />

                {/* People */}
                <circle
                  cx="100"
                  cy="200"
                  r="40"
                  fill="#2C353D"
                  stroke="#A7C3E1"
                  strokeWidth="2"
                />
                <rect
                  x="80"
                  y="250"
                  width="40"
                  height="5"
                  rx="2.5"
                  fill="#A7C3E1"
                />
                <rect
                  x="90"
                  y="260"
                  width="20"
                  height="5"
                  rx="2.5"
                  fill="#A7C3E1"
                />

                <circle
                  cx="500"
                  cy="180"
                  r="40"
                  fill="#2C353D"
                  stroke="#A7C3E1"
                  strokeWidth="2"
                />
                <rect
                  x="480"
                  y="230"
                  width="40"
                  height="5"
                  rx="2.5"
                  fill="#A7C3E1"
                />
                <rect
                  x="490"
                  y="240"
                  width="20"
                  height="5"
                  rx="2.5"
                  fill="#A7C3E1"
                />

                <circle
                  cx="150"
                  cy="380"
                  r="30"
                  fill="#2C353D"
                  stroke="#A7C3E1"
                  strokeWidth="2"
                />
                <rect
                  x="135"
                  y="420"
                  width="30"
                  height="4"
                  rx="2"
                  fill="#A7C3E1"
                />
                <rect
                  x="140"
                  y="430"
                  width="20"
                  height="4"
                  rx="2"
                  fill="#A7C3E1"
                />

                <circle
                  cx="450"
                  cy="350"
                  r="30"
                  fill="#2C353D"
                  stroke="#A7C3E1"
                  strokeWidth="2"
                />
                <rect
                  x="435"
                  y="390"
                  width="30"
                  height="4"
                  rx="2"
                  fill="#A7C3E1"
                />
                <rect
                  x="440"
                  y="400"
                  width="20"
                  height="4"
                  rx="2"
                  fill="#A7C3E1"
                />

                {/* Connecting lines */}
                <path
                  d="M140 200 L190 200"
                  stroke="#5A94C8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M410 180 L460 180"
                  stroke="#5A94C8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M170 350 L200 320"
                  stroke="#5A94C8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M400 320 L430 330"
                  stroke="#5A94C8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Title text */}
                <text
                  x="270"
                  y="120"
                  fontSize="24"
                  fontWeight="bold"
                  fill="#F7F7F7"
                  textAnchor="middle"
                >
                  Edu
                </text>
                <text
                  x="330"
                  y="120"
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
                  Connect, Learn, Grow
                </h2>
                <p className="text-white-100 text-sm mt-2 opacity-80">
                  Join thousands of students and educators in meaningful
                  discussions
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right column with login form */}
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
                  <h1 className="text-3xl font-bold text-gradient">
                    Welcome Back
                  </h1>
                  <p className="text-gray-400 mt-2">Sign in to your account</p>
                </motion.div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <EnhancedLoginForm />
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

export default LoginPage;
