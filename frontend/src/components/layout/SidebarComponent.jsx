import { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const SidebarComponent = () => {
  const { user, isTeacher } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();

  // Check if mobile view on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? "bg-blue-600" : "hover:bg-gray-700";
  };

  // When hovered, expand sidebar
  const handleMouseEnter = () => {
    setIsSidebarHovered(true);
    if (!isMobile) {
      setIsCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    setIsSidebarHovered(false);
    if (!isMobile) {
      setIsCollapsed(true);
    }
  };

  // Toggle sidebar only for mobile
  const toggleSidebar = () => {
    if (isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const sidebarWidth = isCollapsed && !isSidebarHovered ? "w-16" : "w-64";

  return (
    <div className="relative">
      {/* Mobile sidebar toggle button - only visible on mobile */}
      <button
        className="md:hidden fixed top-20 left-0 z-20 bg-gray-800 text-white p-2 rounded-r-md shadow-md"
        onClick={toggleSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={isCollapsed ? "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" : "M6 18L18 6M6 6l12 12"}
          />
        </svg>
      </button>

      {/* Remove desktop toggle button since we're using hover instead */}

      <div
        className={`bg-gray-800 text-white h-full min-h-screen ${sidebarWidth} p-4 transition-all duration-300 ease-in-out fixed md:static z-10 ${
          isCollapsed && isMobile ? "-translate-x-full" : "translate-x-0"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`flex justify-between items-center mb-8 md:mb-10 ${isCollapsed && !isSidebarHovered ? "justify-center" : ""}`}>
          <h2 className={`text-xl font-bold transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0 w-0" : "opacity-100"}`}>
            Navigation
          </h2>
          <button
            className={`md:hidden text-gray-300 hover:text-white transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0 w-0" : "opacity-100"}`}
            onClick={toggleSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Main Navigation with scrolling */}
        <div className="space-y-1 overflow-y-auto h-[calc(100vh-12rem)] pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
          <Link
            to="/dashboard"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive(
              "/dashboard"
            )} transition-all duration-300 ${hoveredItem === "dashboard" ? "bg-blue-500 transform translate-x-2" : ""}`}
            onMouseEnter={() => setHoveredItem("dashboard")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-5 h-5 ${isCollapsed && !isSidebarHovered ? "" : "mr-3"} transition-transform duration-300 ${hoveredItem === "dashboard" ? "scale-125" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <span className={`transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0 w-0" : "opacity-100"}`}>
              Dashboard
            </span>
          </Link>

          <div className={`pt-5 pb-2 transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
            <div className="flex items-center px-4">
              <div className="h-0.5 flex-grow bg-gray-700"></div>
              <h3 className="mx-3 text-sm font-medium text-gray-300">
                POSTS
              </h3>
              <div className="h-0.5 flex-grow bg-gray-700"></div>
            </div>
          </div>

          <Link
            to="/posts/all"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive(
              "/posts/all"
            )} transition-all duration-300 ${hoveredItem === "allposts" ? "bg-blue-500 transform translate-x-2" : ""}`}
            onMouseEnter={() => setHoveredItem("allposts")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-5 h-5 ${isCollapsed && !isSidebarHovered ? "" : "mr-3"} transition-transform duration-300 ${hoveredItem === "allposts" ? "scale-125" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
              />
            </svg>
            <span className={`transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0 w-0" : "opacity-100"}`}>
              All Posts
            </span>
          </Link>

          <Link
            to="/posts/my-posts"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive(
              "/posts/user"
            )} transition-all duration-300 ${hoveredItem === "myposts" ? "bg-blue-500 transform translate-x-2" : ""}`}
            onMouseEnter={() => setHoveredItem("myposts")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-5 h-5 ${isCollapsed && !isSidebarHovered ? "" : "mr-3"} transition-transform duration-300 ${hoveredItem === "myposts" ? "scale-125" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            <span className={`transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0 w-0" : "opacity-100"}`}>
              My Posts
            </span>
          </Link>

          {/* Rest of the navigation links follow the same pattern */}
          <div className={`pt-5 pb-2 transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
            <div className="flex items-center px-4">
              <div className="h-0.5 flex-grow bg-gray-700"></div>
              <h3 className="mx-3 text-sm font-medium text-gray-300">
                NOTICES
              </h3>
              <div className="h-0.5 flex-grow bg-gray-700"></div>
            </div>
          </div>

          <Link
            to="/notices"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive(
              "/notices"
            )} transition-all duration-300 ${hoveredItem === "notices" ? "bg-blue-500 transform translate-x-2" : ""}`}
            onMouseEnter={() => setHoveredItem("notices")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-5 h-5 ${isCollapsed && !isSidebarHovered ? "" : "mr-3"} transition-transform duration-300 ${hoveredItem === "notices" ? "scale-125" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
              />
            </svg>
            <span className={`transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0 w-0" : "opacity-100"}`}>
              All Notices
            </span>
          </Link>

          {isTeacher() && (
            <>
              <Link
                to="/notices/create"
                className={`flex items-center px-4 py-3 rounded-lg ${isActive(
                  "/notices/create"
                )} transition-all duration-300 ${hoveredItem === "createnotice" ? "bg-blue-500 transform translate-x-2" : ""}`}
                onMouseEnter={() => setHoveredItem("createnotice")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={`w-5 h-5 ${isCollapsed && !isSidebarHovered ? "" : "mr-3"} transition-transform duration-300 ${hoveredItem === "createnotice" ? "scale-125" : ""}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span className={`transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0 w-0" : "opacity-100"}`}>
                  Create Notice
                </span>
              </Link>
            </>
          )}

          <div className={`pt-5 pb-2 transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
            <div className="flex items-center px-4">
              <div className="h-0.5 flex-grow bg-gray-700"></div>
              <h3 className="mx-3 text-sm font-medium text-gray-300">
                SETTINGS
              </h3>
              <div className="h-0.5 flex-grow bg-gray-700"></div>
            </div>
          </div>

          <Link
            to="/settings"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive(
              "/settings"
            )} transition-all duration-300 ${hoveredItem === "settings" ? "bg-blue-500 transform translate-x-2" : ""}`}
            onMouseEnter={() => setHoveredItem("settings")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-5 h-5 ${isCollapsed && !isSidebarHovered ? "" : "mr-3"} transition-transform duration-300 ${hoveredItem === "settings" ? "scale-125" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className={`transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0 w-0" : "opacity-100"}`}>
              Settings
            </span>
          </Link>

          <div className={`pt-5 pb-2 transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
            <div className="flex items-center px-4">
              <div className="h-0.5 flex-grow bg-gray-700"></div>
              <h3 className="mx-3 text-sm font-medium text-gray-300">
                HELP
              </h3>
              <div className="h-0.5 flex-grow bg-gray-700"></div>
            </div>
          </div>

          <Link
            to="/faq"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive(
              "/faq"
            )} transition-all duration-300 ${hoveredItem === "faq" ? "bg-blue-500 transform translate-x-2" : ""}`}
            onMouseEnter={() => setHoveredItem("faq")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-5 h-5 ${isCollapsed && !isSidebarHovered ? "" : "mr-3"} transition-transform duration-300 ${hoveredItem === "faq" ? "scale-125" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
            <span className={`transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0 w-0" : "opacity-100"}`}>
              FAQ
            </span>
          </Link>
        </div>

        {/* Fixed Footer */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0" : "opacity-100"}`}>
          <div className="space-y-1">
            <Link
              to="/faq"
              className={`flex items-center px-4 py-2 rounded-lg ${isActive(
                "/faq"
              )} transition-all duration-300 ${hoveredItem === "faq" ? "bg-blue-500 transform translate-x-2" : ""}`}
              onMouseEnter={() => setHoveredItem("faq")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`w-5 h-5 ${isCollapsed && !isSidebarHovered ? "" : "mr-3"} transition-transform duration-300 ${hoveredItem === "faq" ? "scale-125" : ""}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
              <span className={`transition-opacity duration-300 ${isCollapsed && !isSidebarHovered ? "opacity-0 w-0" : "opacity-100"}`}>
                FAQ
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;