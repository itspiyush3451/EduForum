import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import EditPostModal from "./EditPostModal";

const MyPostsContainer = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user's posts from the backend server
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userid;
    console.log(userId);
    fetch(`http://localhost:3000/api/posts/userposts?userid=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMyPosts(data); // Set the fetched posts to the state
      })
      .catch((error) => {
        console.error("Error fetching user's posts:", error);
      });
  }, []);
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedPost(null);
  };

  // Function to handle deleting a post
  const handleDeletePost = (postId) => {
    // Send a DELETE request to the backend to delete the post
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // If the post was deleted successfully, remove it from the state
          setMyPosts(myPosts.filter((post) => post.postid !== postId));
        } else {
          throw new Error("Failed to delete post.");
        }
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  // Function to handle editing a post
  const handleEditPost = (postId, content) => {
    setSelectedPost({ postId, content });
    setIsEditing(true);
  };

  const handleSaveEdit = (postId, newContent) => {
    // Send a PUT request to update the post
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newContent }),
    })
      .then((response) => {
        if (response.ok) {
          // Update the post content in the state
          const updatedPosts = myPosts.map((post) => {
            if (post.postid === postId) {
              return { ...post, content: newContent };
            }
            return post;
          });
          setMyPosts(updatedPosts);
          // Close the edit modal
          handleCancelEdit();
        } else {
          throw new Error("Failed to update post.");
        }
      })
      .catch((error) => {
        console.error("Error updating post:", error);
      });
  };

  return (
    <div className="mx-2 my-2 w-full drop-shadow-sm overflow-y-scroll scrollbar-webkit ">
      {myPosts.map((post) => (
        <div key={post.postid} className="flex bg-gray-700 mt-2 rounded-lg drop-shadow-sm mr-2 cursor-pointer">
          <div className="ml-8 flex-grow">
            <p className="mt-4 text-white-100 text-semibold">{post.content}</p>
            <div className="mt-2 text-white-100 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                className="w-8 h-8 inline-block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              {post.user.username}
            </div>
          </div>
          <div className="flex items-center mr-2 text-white-100">
            <button
              className="text-white rounded-lg bg-blue-500 py-2 px-4 mr-2"
              onClick={() => handleEditPost(post.postid, post.content)}
            >
              Edit
            </button>
            <button
              className="rounded-lg bg-red-500 py-2 px-4"
              onClick={() => handleDeletePost(post.postid)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
       {isEditing && selectedPost && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-500">
          <EditPostModal
            postId={selectedPost.postId}
            initialContent={selectedPost.content}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        </div>
      )}
    </div>
  );
};

export default MyPostsContainer;
