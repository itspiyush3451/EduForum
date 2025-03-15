import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Notices from "./pages/Notices";
import MyNotices from "./pages/MyNotices";
import MyPosts from "./pages/MyPosts";
import Settings from "./pages/Settings";
import FAQPage from "./pages/FAQPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import NavbarComponent from "./components/layout/NavbarComponent";
import SidebarComponent from "./components/layout/SidebarComponent";
import Footer from "./components/layout/Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ["/", "/login", "/signup"].includes(location.pathname);

  return (
    <div className="flex">
      {!isAuthPage && <SidebarComponent />}
      <div className="flex-1">
        {!isAuthPage && <NavbarComponent />}
        {children} {/* This renders the active page */}
        {!isAuthPage && <Footer />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes (Only after login) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/allnotices" element={<Notices />} />
          <Route path="/mynotices" element={<MyNotices />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
