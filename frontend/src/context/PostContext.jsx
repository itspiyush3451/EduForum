// src/context/PostContext.jsx
import React, { createContext, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { postService } from "../services/postService";
import { useAuth } from "../hooks/useAuth";

// Create context
export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { user } = useAuth();
  // State for posts
  const [userPosts, setUserPosts] = useState([]);
  const [departmentPosts, setDepartmentPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error when navigating away
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

  // Fetch all posts
  const fetchAllPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await postService.getAllPosts();
      console.log("Posts response:", response);
      const posts = Array.isArray(response) ? response : [];
      console.log("Processed posts:", posts);
      
      // Filter posts by user's department
      const userDepartmentId = user?.departmentid;
      const filteredPosts = userDepartmentId 
        ? posts.filter(post => post.departmentid === userDepartmentId)
        : [];
      
      setAllPosts(posts);
      setDepartmentPosts(filteredPosts);
      setError(null);
    } catch (err) {
      console.error("Error in fetchAllPosts:", err);
      setError(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [user?.departmentid]);

  // Fetch user's posts
  const fetchUserPosts = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching user posts...');
      const posts = await postService.getUserPosts();
      console.log('Received posts:', posts);
      
      // Ensure posts is an array
      const postsArray = Array.isArray(posts) ? posts : [];
      console.log('Processed posts array:', postsArray);
      
      // No need to filter by user ID since the backend already returns only the user's posts
      setUserPosts(postsArray);
      setError(null);
    } catch (err) {
      console.error("Error fetching user posts:", err);
      setError(err.message || "Failed to fetch your posts");
      setUserPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch post by ID
  const fetchPostById = useCallback(async (postId) => {
    setLoading(true);
    try {
      const post = await postService.getPostById(postId);
      setCurrentPost(post);
      setError(null);
      return post;
    } catch (err) {
      setError(err.message || "Failed to fetch post");
      console.error("Error fetching post:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new post
  const createPost = useCallback(async (postData) => {
    setLoading(true);
    try {
      const response = await postService.createPost(postData);
      const newPost = response; // The response is already the post object
      
      // Update department posts - add new post to the beginning of the list
      setDepartmentPosts(prevPosts => [newPost, ...(Array.isArray(prevPosts) ? prevPosts : [])]);
      
      // Update user posts
      setUserPosts(prevPosts => [newPost, ...(Array.isArray(prevPosts) ? prevPosts : [])]);
      
      setError(null);
      return newPost;
    } catch (err) {
      setError(err.message || "Failed to create post");
      console.error("Error creating post:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update post
  const updatePost = useCallback(
    async (postId, postData) => {
      setLoading(true);
      try {
        console.log('Updating post with data:', { postId, postData });
        const updatedPost = await postService.updatePost(postId, postData);
        console.log('Received updated post from server:', updatedPost);

        if (!updatedPost) {
          throw new Error('No updated post data received');
        }

        // First, refresh the user posts to get the latest data
        console.log('Refreshing user posts...');
        const refreshedPosts = await postService.getUserPosts();
        console.log('Refreshed user posts:', refreshedPosts);
        setUserPosts(refreshedPosts);

        // Update in department posts list
        setDepartmentPosts(prevPosts => {
          const newPosts = prevPosts.map(post => 
            post.postid === postId ? { ...post, ...updatedPost } : post
          );
          console.log('Updated department posts:', newPosts);
          return newPosts;
        });

        // Update in all posts list
        setAllPosts(prevPosts => {
          const newPosts = prevPosts.map(post => 
            post.postid === postId ? { ...post, ...updatedPost } : post
          );
          console.log('Updated all posts:', newPosts);
          return newPosts;
        });

        // Update current post if it's the same one
        if (currentPost && currentPost.postid === postId) {
          console.log('Updating current post:', updatedPost);
          setCurrentPost({ ...currentPost, ...updatedPost });
        }

        setError(null);
        return updatedPost;
      } catch (err) {
        console.error('Error in updatePost:', err);
        setError(err.message || "Failed to update post");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentPost]
  );

  // Delete post
  const deletePost = useCallback(async (postId) => {
    setLoading(true);
    try {
      await postService.deletePost(postId);

      // Remove from department posts list
      setDepartmentPosts(prevPosts =>
        prevPosts.filter(post => post.postid !== postId)
      );

      // Remove from user posts list
      setUserPosts(prevPosts =>
        prevPosts.filter(post => post.postid !== postId)
      );

      setError(null);
      return true;
    } catch (err) {
      setError(err.message || "Failed to delete post");
      console.error("Error deleting post:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Context value
  const value = {
    userPosts,
    departmentPosts,
    allPosts,
    currentPost,
    loading,
    error,
    fetchAllPosts,
    fetchUserPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

PostProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PostContext;
