import NavbarComponent from "../components/layout/NavbarComponent";
import Footer from "../components/layout/Footer";
import SidebarComponent from "../components/layout/SidebarComponent";
import PostContainer from "../components/posts/PostContainer";
import ChatbotComponent from "../components/chatbot/ChatbotComponent";

const Dashboard = () => {
  return (
    <div className="font-poppins">
      <div className="">
        <NavbarComponent />
      </div>
      <div className="bg-gray-600 h-screen flex justify-start z-1">
        <div className="sidebar w-1/5 drop-shadow-lg ml-4">
          <div>
            <SidebarComponent />
          </div>
        </div>
        <div className="mt-4 mr-24 postsContainer w-3/5 flex justify-center bg-gray-800 rounded-lg drop-shadow-lg">
          <PostContainer />
        </div>
        <div className="w-1/4 bg-gray-800 rounded-lg mt-4 mr-8">
          <ChatbotComponent />
        </div>
      </div>
      <p className="text-center text-gray-500 text-xs">
        <Footer />
      </p>
    </div>
  );
};

export default Dashboard;
