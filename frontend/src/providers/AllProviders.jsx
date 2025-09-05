import PropTypes from "prop-types";
import { AuthProvider } from "../context/AuthContext";
import { PostProvider } from "../context/PostContext";
import { CommentProvider } from "../context/CommentContext";
import { NoticeProvider } from "../context/NoticeContext";
import { DepartmentProvider } from "../context/DepartmentContext";
import { ThemeProvider } from "../context/ThemeContext";

const AllProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DepartmentProvider>
          <PostProvider>
            <NoticeProvider>
              <CommentProvider>{children}</CommentProvider>
            </NoticeProvider>
          </PostProvider>
        </DepartmentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

AllProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AllProviders;
