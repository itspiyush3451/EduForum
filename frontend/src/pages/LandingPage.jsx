import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/layout/Footer";
import Logo from "../components/common/Logo";
import mainImg from "../assets/main-img.svg";
import connectImg from "../assets/connect.svg";

const LandingPage = () => {
  const [navtoggle, setnavtoggle] = useState(false);
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onContactUs = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: isDarkMode ? "dark" : "light",
    });
    setEmail("");
    setDescription("");
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header with improved styling and animations */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? (isDarkMode ? 'bg-gray-800/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm') 
          : (isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-50 to-indigo-50')
      } ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center py-4">
          {/* Left side - Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Logo size="small" className="group-hover:scale-105 transition-transform duration-300" />
          </Link>

          {/* Right side - Navigation and Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } transition-colors duration-300`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="md:hidden text-current p-2 rounded-lg hover:bg-opacity-10 hover:bg-blue-500 focus:outline-none transition duration-300"
              onClick={() => setnavtoggle(!navtoggle)}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {navtoggle ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Navigation with improved dropdown and animations */}
          <nav
            className={`${
              navtoggle ? "block" : "hidden"
            } md:block absolute md:relative top-16 right-4 left-4 md:top-0 md:right-0 md:left-auto ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
            } md:bg-transparent md:border-0 shadow-2xl md:shadow-none rounded-xl md:rounded-none z-50 md:w-auto transition-transform duration-300`}
          >
            <ul className="md:flex md:items-center space-y-3 md:space-y-0 md:space-x-6 p-5 md:p-0">
              <li>
                <Link
                  to="/"
                  className={`font-medium block py-2 px-3 md:px-3 rounded-lg transition duration-300 ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                      : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className={`font-medium block py-2 px-3 md:px-3 rounded-lg transition duration-300 ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                      : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className={`font-medium block py-2 px-3 md:px-3 rounded-lg transition duration-300 ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                      : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Contact
                </a>
              </li>
              <li className="pt-3 md:pt-0 border-t md:border-0 border-gray-200 dark:border-gray-700">
                <Link
                  to="/login"
                  className={`${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                  } text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 block text-center md:inline-block`}
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section with improved styling and animations */}
        <section
          id="home"
          className={`py-16 md:py-28 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
              : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100'
          } overflow-hidden`}
        >
          <div className="container mx-auto px-6 md:flex items-center gap-10">
            {/* Left Text Section with animations */}
            <div className="md:w-1/2 mb-14 md:mb-0">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                    isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'
                  } mb-4`}> Next Generation Campus Platform</span>
                </div>
                
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Revolutionize <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Campus</span> Communication
                </h1>
                
                <p className={`mb-8 text-lg leading-relaxed max-w-xl ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Introducing{" "}
                  <span className="font-semibold text-blue-600">EduForum</span> —
                  a smart academic chatbot and forum system that connects
                  students, teachers, and administrators effortlessly on one
                  intelligent platform.
                </p>

                {/* Features list before signup buttons */}
                 <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
                 
                  
                </div> 

                {/* Signup Buttons Section */}
                <div className="w-full max-w-4xl">
  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
    Choose Your Role
  </h3>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {/* Student Card */}
    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/80' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}>
      <Link
        to="/signup/student"
        className="w-full flex flex-col"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center shadow-lg shrink-0`}>
            <svg className={`w-6 h-6 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Student</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Join as a student
            </p>
          </div>
        </div>
        <div className="mt-2">
          <span className={`block px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium transition-all duration-300 text-center`}>
            Sign Up →
          </span>
        </div>
      </Link>
    </div>

    {/* Teacher Card */}
    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/80' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}>
      <Link
        to="/signup/teacher"
        className="w-full flex flex-col"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'} flex items-center justify-center shadow-lg shrink-0`}>
            <svg className={`w-6 h-6 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Teacher</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Join as a teacher
            </p>
          </div>
        </div>
        <div className="mt-2">
          <span className={`block px-4 py-2 rounded-lg ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white font-medium transition-all duration-300 text-center`}>
            Sign Up →
          </span>
        </div>
      </Link>
    </div>

    {/* Admin Card */}
    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/80' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}>
      <Link
        to="/signup/admin"
        className="w-full flex flex-col"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} flex items-center justify-center shadow-lg shrink-0`}>
            <svg className={`w-6 h-6 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Admin</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Join as an admin
            </p>
          </div>
        </div>
        <div className="mt-2">
          <span className={`block px-4 py-2 rounded-lg ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white font-medium transition-all duration-300 text-center`}>
            Sign Up →
          </span>
        </div>
      </Link>
    </div>
  </div>
</div>
              </div>
            </div>

            {/* Right Vector Section with animations */}
            <div className="md:w-1/2 flex justify-center">
              <img
                src={mainImg}
                alt="Chatbot illustration"
                className="w-full max-w-md md:max-w-lg drop-shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Info Section - Replacing Stats */}
        <section className={`py-16 ${isDarkMode ? 'bg-secondary' : 'bg-primary'}`}>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-tertiary' : 'bg-secondary'}`}>
                <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-text' : 'text-text'}`}>
                  For Students
                </h3>
                <ul className={`space-y-3 ${isDarkMode ? 'text-textSecondary' : 'text-textSecondary'}`}>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-1 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Access department-specific notices and announcements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-1 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Get instant answers from our AI-powered chatbot</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-1 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Stay updated with real-time department notifications</span>
                  </li>
                </ul>
              </div>

              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-tertiary' : 'bg-secondary'}`}>
                <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-text' : 'text-text'}`}>
                  For Educators
                </h3>
                <ul className={`space-y-3 ${isDarkMode ? 'text-textSecondary' : 'text-textSecondary'}`}>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-1 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Create and manage department notices efficiently</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-1 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Monitor student engagement with notices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-1 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Share important updates and resources with students</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with improved layout and animations */}
        <section
          id="features"
          className={`py-24 ${
            isDarkMode 
              ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
              : 'bg-gradient-to-b from-gray-50 to-blue-50'
          } relative`}
        >
          <div className="container mx-auto px-6 lg:px-16">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'
              } mb-4`}> Powerful Features</span>
              
              <h2 className={`text-3xl md:text-4xl font-extrabold mb-6 tracking-tight ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Everything You Need for Academic Success
              </h2>
              
              <p className={`text-lg leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                EduForum equips institutions with modern tools to revolutionize
                academic communication and streamline feedback processes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature Card 1 - Academic Forums */}
              <div className={`p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border ${
                isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-blue-100'
              } group relative overflow-hidden`}>
                <div className={`absolute inset-0 ${
                  isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                } transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-out -z-10 rounded-2xl`}></div>
                
                <div className={`${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-blue-900 to-blue-700' 
                    : 'bg-gradient-to-br from-blue-100 to-blue-300'
                } w-16 h-16 flex items-center justify-center rounded-xl mb-6`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Academic Forums
                </h3>
                
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Structured discussion boards organized by courses,
                  departments, and special interest topics. Encourage meaningful
                  academic discourse across your institution.
                </p>
                
                <ul className={`mt-4 space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Course-specific boards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Rich media sharing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Faculty moderation</span>
                  </li>
                </ul>
              </div>

              {/* Feature Card 2 - AI-Powered Chatbot */}
              <div className={`p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border ${
                isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-blue-100'
              } group relative overflow-hidden`}>
                <div className={`absolute inset-0 ${
                  isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'
                } transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-out -z-10 rounded-2xl`}></div>
                
                <div className={`${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-purple-900 to-purple-700' 
                    : 'bg-gradient-to-br from-purple-100 to-purple-300'
                } w-16 h-16 flex items-center justify-center rounded-xl mb-6`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  AI-Powered Chatbot
                </h3>
                
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Intelligent assistant that provides instant answers to academic
                  queries, course information, and campus resources 24/7.
                </p>
                
                <ul className={`mt-4 space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>24/7 instant support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Course material assistance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Smart resource suggestions</span>
                  </li>
                </ul>
              </div>

              {/* Feature Card 3 - Department Management */}
              <div className={`p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border ${
                isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-blue-100'
              } group relative overflow-hidden`}>
                <div className={`absolute inset-0 ${
                  isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
                } transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-out -z-10 rounded-2xl`}></div>
                
                <div className={`${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-green-900 to-green-700' 
                    : 'bg-gradient-to-br from-green-100 to-green-300'
                } w-16 h-16 flex items-center justify-center rounded-xl mb-6`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Department Management
                </h3>
                
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Streamlined department management with role-based access,
                  notice boards, and efficient communication channels.
                </p>
                
                <ul className={`mt-4 space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Role-based access control</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Department notice boards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Efficient communication</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section with improved styling and animations */}
        <section
          id="contact"
          className={`py-24 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
              : 'bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50'
          }`}
        >
          <div className="container mx-auto px-6">
            <div className="md:flex items-center">
              {/* Left Content - Heading & Image */}
              <div className="md:w-1/2 mb-12 md:mb-0">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'
                } mb-4`}>Get In Touch</span>
                
                <h2 className={`text-3xl md:text-4xl font-extrabold leading-tight mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Let's Connect
                </h2>
                
                <p className={`text-lg mb-10 max-w-md ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Whether you have questions about implementing EduForum at your
                  institution or just want to say hello, our team is ready to
                  hear from you.
                </p>
                
                <div className="max-w-md">
                  <img
                    src={connectImg}
                    alt="Contact Illustration"
                    className="rounded-xl shadow-xl"
                  />
                </div>
              </div>

              {/* Right Content - Contact Form */}
              <div className="md:w-1/2 md:pl-10">
                <form
                  className={`p-8 rounded-2xl shadow-xl border ${
                    isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
                  }`}
                  onSubmit={onContactUs}
                >
                  <div className="mb-6">
                    <label
                      htmlFor="name"
                      className={`block font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your Name"
                      required
                      className={`w-full px-5 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className={`block font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className={`w-full px-5 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div className="mb-8">
                    <label
                      htmlFor="message"
                      className={`block font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="How can we help you?"
                      required
                      rows="5"
                      className={`w-full px-5 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none transition-all duration-300 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                    } text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;