import NavbarComponent from "../components/layout/NavbarComponent";
import SidebarComponent from "../components/layout/SidebarComponent";
import MyPostsContainer from "../components/posts/MyPostsContainer";
import ChatbotComponent from "../components/chatbot/ChatbotComponent";

const MyPosts = () => {
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
          <MyPostsContainer />
        </div>
        <div className="w-1/4 bg-gray-800 rounded-lg mt-4 mr-8">
          <ChatbotComponent />
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
