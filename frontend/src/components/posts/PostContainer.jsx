import React, { useState, useEffect } from "react";
import PostDetails from "./PostDetails";
import { jwtDecode } from "jwt-decode";

const PostContainer = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userid;
  useEffect(() => {
    // Fetch posts from your backend server
    fetch("http://localhost:3000/api/posts/all", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data); // Set the fetched posts to the state
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  const handleCreatePost = () => {
    // Ensure the content is not empty
    if (content.trim() === "") {
      alert("Please enter the contents of the post.");
      return;
    }

    // Create a new post object
    const newPost = {
      content: content
    };

    // Send the new post to the backend
    fetch("http://localhost:3000/api/posts/createpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(newPost)
    })
      .then((response) => {
        if (response.ok) {
          // If the post was created successfully, refresh the posts list
          return response.json();
        } else {
          throw new Error("Failed to create post.");
        }
      })
      .then(() => {
        // Clear the content field after successfully creating the post
        setContent("");
        // Refresh the posts list
        refreshPosts();
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };

  const refreshPosts = () => {
    const token = localStorage.getItem("token");
    // Fetch posts from the backend server
    fetch("http://localhost:3000/api/posts/all", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data); // Set the fetched posts to the state
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  const handlePostClick = (postId) => {
    // Set the ID of the clicked post
    setSelectedPostId(postId);
  };

  const handleClosePostDetails = () => {
    // Reset the selected post ID to close the popup
    setSelectedPostId(null);
  };

  return (
    <>
      <div className="mx-2 my-2 w-full drop-shadow-sm overflow-y-scroll  scrollbar-webkit">
        <div className="flex bg-gray-700 mt-2 h-28 rounded-lg items-center mx-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="white"
            className="ml-4 w-16 h-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>

          <div className="ml-8 flex">
            <input
              type="text"
              placeholder="enter the contents of post"
              className=" drop-shadow-sm my-2 px-2 py-2 h-8 rounded-md border border-gray-800 bg-gray-800 text-white-100 w-96 focus:outline-none focus:ring ring-blue-500 focus:ring-opacity-50"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button className="text-white-100 rounded-lg bg-blue-100 mx-2 py-2 px-4 " onClick={handleCreatePost}>
              Create Post
            </button>
          </div>
        </div>
        {posts.map((post) => (
          <div className="grid grid-cols-1 mx-2">
            <div key={post.postid} className="flex bg-gray-700 mt-2 h-28 rounded-lg  drop-shadow-sm cursor-pointer" onClick={() => handlePostClick(post.postid)}>
              {/* Render post content here */}
              <div className="ml-8  ">
                <p className="mt-4 text-white-100 text-semibold" >{post.content}</p>
                <div className="mt-2 text-white-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="white"
                    className=" w-8 h-8 inline-block"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  {post.user.username}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedPostId && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-500">
        <PostDetails 
          currentUserId={userId}
          postId={selectedPostId}
          onClose={handleClosePostDetails}
        />
        </div>
      )}
    </>
  );
};

export default PostContainer;
