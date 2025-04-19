// EnhancedLoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { Lock, Mail, EyeOff, Eye } from "lucide-react";

const EnhancedLoginForm = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.identifier.trim()) {
      newErrors.identifier = "Username or Email is required";
    } else if (
      formData.identifier.includes("@") &&
      !emailRegex.test(formData.identifier)
    ) {
      newErrors.identifier = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      await login({
        identifier: formData.identifier,
        password: formData.password,
        rememberMe: rememberMe,
      });
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        if (error.response.status === 401) {
          setErrors({
            form: "Invalid username, email, or password. Please try again.",
          });
        } else if (error.response.status === 429) {
          setErrors({
            form: "Too many login attempts. Please try again later.",
          });
        } else {
          setErrors({
            form: "An error occurred during login. Please try again.",
          });
        }
      } else if (error.request) {
        setErrors({
          form: "No response from server. Please check your internet connection.",
        });
      } else {
        setErrors({ form: "An unexpected error occurred. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    focused: {
      boxShadow: "0 0 0 2px rgba(9, 79, 142, 0.5)",
      transition: { duration: 0.2 },
    },
    unfocused: {
      boxShadow: "none",
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    idle: {
      scale: 1,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
    },
    hover: {
      scale: 1.02,
      boxShadow:
        "0 7px 14px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.08)",
    },
    tap: {
      scale: 0.98,
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)",
    },
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <div className="bg-secondary rounded-2xl overflow-hidden shadow-xl">
        <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 space-y-6">
          {errors.form && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-error-500/10 border border-error-500/20 text-error-500 px-4 py-3 rounded-lg text-sm"
            >
              {errors.form}
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label
                className="block text-white-100 text-sm font-medium mb-2"
                htmlFor="identifier"
              >
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={formData.identifier}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("identifier")}
                  onBlur={() => setFocusedField(null)}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.identifier ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white`}
                  placeholder="Enter your username or email"
                  aria-invalid={!!errors.identifier}
                  aria-describedby={
                    errors.identifier ? "identifier-error" : undefined
                  }
                />
              </div>
              {errors.identifier && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-error-500 text-xs mt-1"
                  id="identifier-error"
                >
                  {errors.identifier}
                </motion.p>
              )}
            </div>

            <div>
              <label
                className="block text-white-100 text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={`block w-full pl-10 pr-10 py-2 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white`}
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-white-100 focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-error-500 text-xs mt-1"
                  id="password-error"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-tertiary"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-400"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-500 text-white-100 font-medium py-3 px-4 rounded-lg focus:outline-none transition-all ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Logging in...
                </div>
              ) : (
                "Log in"
              )}
            </motion.button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-600 flex-grow"></div>
              <div className="px-4 text-sm text-gray-500">OR</div>
              <div className="border-t border-gray-600 flex-grow"></div>
            </div>

            <motion.button
              type="button"
              className="w-full flex items-center justify-center bg-tertiary border border-gray-600 text-white-100 font-medium py-3 px-4 rounded-lg focus:outline-none transition-all"
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </motion.button>
          </div>

          <div className="flex items-center justify-center text-white mt-6">
            <motion.a
              className="font-medium text-sm text-blue-400 hover:text-blue-300 transition-colors"
              href="/signup"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Don't have an account? <span className="font-bold">Sign Up</span>
            </motion.a>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EnhancedLoginForm;
