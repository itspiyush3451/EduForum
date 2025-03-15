import NavbarComponent from "../components/layout/NavbarComponent";
import SidebarComponent from "../components/layout/SidebarComponent";
import ChatbotComponent from "../components/chatbot/ChatbotComponent";
import FAQ from "../components/chatbot/FAQ";

const FAQPage = () => {
  return (
    <div className="font-poppins">
      <NavbarComponent />
      <div className="bg-gray-600 h-screen flex">
        {/* Sidebar */}
        <div className="w-1/5 drop-shadow-lg ml-4">
          <SidebarComponent />
        </div>

        {/* FAQ Section */}
        <div className="mt-4 mr-24 w-3/5 flex justify-center bg-gray-800 rounded-lg drop-shadow-lg">
          <FAQ />
        </div>

        {/* Chatbot */}
        <div className="w-1/4 bg-gray-800 rounded-lg mt-4 mr-8">
          <ChatbotComponent />
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
