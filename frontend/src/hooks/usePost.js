// src/hooks/usePost.js
import { useContext } from "react";
import PostContext from "../context/PostContext";

/**
 * Custom hook to access the Post context
 * @returns {Object} Post context values and methods
 */
export const usePost = () => {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }

  return context;
};

export default usePost;
