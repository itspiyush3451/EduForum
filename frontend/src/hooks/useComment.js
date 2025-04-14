import { useContext } from "react";
import { CommentContext } from "../context/CommentContext";

/**
 * Custom hook for accessing the comment context
 * @returns {Object} Comment context object
 */
export const useComments = () => {
  const context = useContext(CommentContext);

  if (!context) {
    throw new Error("useComments must be used within a CommentProvider");
  }

  return context;
};

export default useComments;
