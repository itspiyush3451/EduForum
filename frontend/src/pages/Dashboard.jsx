import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import PostContainer from "../components/posts/PostContainer";
import Chatbot from "../components/chatbot/Chatbot";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDarkMode } = useTheme();
  const sidebarWidth = "w-96";

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Main content area that expands to take full width when sidebar is closed */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "mr-96 w-[calc(100%-24rem)]" : "w-full mr-0"
        } overflow-y-auto scrollbar-hide`}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div
            className={`rounded-xl shadow-md ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {sidebarOpen ? "Close Chatbot" : "Open Chatbot"}
              </button>
            </div>
            <PostContainer />
          </div>
        </div>
      </div>

      {/* Fixed sidebar - chatbot with toggle functionality */}
      <div
        className={`fixed right-0 top-0 ${sidebarWidth} h-screen shadow-md z-10 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 mt-16"></div>
          <div className="flex-1 overflow-hidden">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
