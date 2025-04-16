import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import NavbarComponent from "../layout/NavbarComponent";
import SidebarComponent from "../layout/SidebarComponent";
import Footer from "../layout/Footer";

const MainLayout = () => {
  const { loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavbarComponent />
      <div className="flex flex-1 pt-16"> {/* Changed from overflow-hidden to allow main content to scroll */}
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)]"> {/* Fixed sidebar with proper height calculation */}
          <SidebarComponent />
        </div>
        <main className="flex-1 ml-16 md:ml-64 overflow-y-auto p-4"> {/* Added margin to account for sidebar width */}
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;