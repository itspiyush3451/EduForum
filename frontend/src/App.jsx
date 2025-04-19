import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";
import { CommentProvider } from "./context/CommentContext";
import { NoticeProvider } from "./context/NoticeContext";
import { DepartmentProvider } from "./context/DepartmentContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const App = () => {
  return (
    <Router future={{ v7_startTransition: true }}>
      <ThemeProvider>
        <AuthProvider>
          <DepartmentProvider>
            <PostProvider>
              <NoticeProvider>
                <CommentProvider>
                  <AppRoutes />
                  <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                </CommentProvider>
              </NoticeProvider>
            </PostProvider>
          </DepartmentProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
