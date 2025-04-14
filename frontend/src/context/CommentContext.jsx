import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
} from "react";
import {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
} from "../services/commentService";
import PropTypes from "prop-types";

// Define initial state
const initialState = {
  comments: {},
  loading: false,
  error: null,
  currentPostId: null,
};

// CommentProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// Define action types
const FETCH_COMMENTS_START = "FETCH_COMMENTS_START";
const FETCH_COMMENTS_SUCCESS = "FETCH_COMMENTS_SUCCESS";
const FETCH_COMMENTS_FAILURE = "FETCH_COMMENTS_FAILURE";
const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
const UPDATE_COMMENT_SUCCESS = "UPDATE_COMMENT_SUCCESS";
const DELETE_COMMENT_SUCCESS = "DELETE_COMMENT_SUCCESS";
const CLEAR_COMMENTS = "CLEAR_COMMENTS";

// Create reducer function
const commentReducer = (state, action) => {
  switch (action.type) {
    case FETCH_COMMENTS_START:
      return {
        ...state,
        loading: true,
        error: null,
        currentPostId: action.payload,
      };
    case FETCH_COMMENTS_SUCCESS:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.postId]: action.payload.comments,
        },
        loading: false,
      };
    case FETCH_COMMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.postId]: [
            ...(state.comments[action.payload.postId] || []),
            action.payload.comment,
          ],
        },
      };
    case UPDATE_COMMENT_SUCCESS:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.postId]: state.comments[action.payload.postId].map(
            (comment) =>
              comment.commentid === action.payload.comment.commentid
                ? action.payload.comment
                : comment
          ),
        },
      };
    case DELETE_COMMENT_SUCCESS:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.postId]: state.comments[action.payload.postId].filter(
            (comment) => comment.commentid !== action.payload.commentId
          ),
        },
      };
    case CLEAR_COMMENTS:
      return {
        ...state,
        comments: {},
        currentPostId: null,
      };
    default:
      return state;
  }
};

// Create context
export const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(commentReducer, initialState);

  // Fetch comments for a specific post
  const fetchComments = useCallback(async (postId) => {
    if (!postId) return;

    try {
      dispatch({ type: FETCH_COMMENTS_START, payload: postId });
      const comments = await getPostComments(postId);
      
      console.log('Processed comments:', comments);
      
      dispatch({
        type: FETCH_COMMENTS_SUCCESS,
        payload: { postId, comments },
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to fetch comments";
      dispatch({
        type: FETCH_COMMENTS_FAILURE,
        payload: errorMessage,
      });
    }
  }, []);

  // Add a new comment
  const addComment = useCallback(
    async (postId, content, departmentId = null) => {
      try {
        const newComment = await createComment(postId, content, departmentId);
        dispatch({
          type: ADD_COMMENT_SUCCESS,
          payload: { postId, comment: newComment },
        });
        return newComment;
      } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
      }
    },
    []
  );

  // Edit an existing comment
  const editComment = useCallback(async (postId, commentId, content) => {
    try {
      const updatedComment = await updateComment(commentId, content);
      dispatch({
        type: UPDATE_COMMENT_SUCCESS,
        payload: { postId, comment: updatedComment },
      });
      return updatedComment;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  }, []);

  // Remove a comment
  const removeComment = useCallback(async (postId, commentId) => {
    try {
      await deleteComment(commentId);
      dispatch({
        type: DELETE_COMMENT_SUCCESS,
        payload: { postId, commentId },
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }, []);

  // Clear comments (useful when navigating away from a post)
  const clearComments = useCallback(() => {
    dispatch({ type: CLEAR_COMMENTS });
  }, []);

  const value = {
    comments: state.comments,
    loading: state.loading,
    error: state.error,
    currentPostId: state.currentPostId,
    fetchComments,
    addComment,
    editComment,
    removeComment,
    clearComments,
  };

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};

// Custom hook for using the comment context
export const useComments = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useComments must be used within a CommentProvider");
  }
  return context;
};
