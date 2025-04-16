import React from "react";
import PostContainer from "../components/posts/PostContainer";
// import ChatbotComponent from "../components/chatbot/ChatbotComponent";

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row flex-1 gap-4">
      <div className="w-full md:w-3/5 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
        <PostContainer />
      </div>
      {/* Commented section for potential future chatbot implementation */}
      {/* <div className="w-full md:w-1/4 mt-4 md:mt-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
        <ChatbotComponent />
      </div> */}
    </div>
  );
};

export default Dashboard;