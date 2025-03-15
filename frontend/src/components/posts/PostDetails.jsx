import React, { useState, useEffect } from 'react';

const PostDetails = ({ postId, currentUserId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch comments for the post from the backend server
    fetch(`http://localhost:3000/api/comments/post/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  }, [postId]);

  const handleDeleteComment = (commentId) => {
    // Send a DELETE request to the backend to delete the comment
    fetch(`http://localhost:3000/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
      },
    })
      .then((response) => {
        if (response.ok) {
          // Remove the deleted comment from the state
          setComments(comments.filter((comment) => comment.commentid !== commentId));
        } else {
          throw new Error('Failed to delete comment.');
        }
      })
      .catch((error) => {
        console.error('Error deleting comment:', error);
      });
  };

  const handleAddComment = () => {
    // Send a POST request to the backend to create a new comment
    fetch(`http://localhost:3000/api/comments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
      },
      body: JSON.stringify({
        postid : postId,
        content: newComment,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // Refresh the comments list after successfully adding the comment
          return response.json();
        } else {
          throw new Error('Failed to add comment.');
        }
      })
      .then((data) => {
        // Add the new comment to the state
        setComments([...comments, data.comment]);
        // Clear the input field
        setNewComment('');
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  return (
    <div className="w-full bg-gray-700 rounded-lg text-white-100 ml-2 mr-2 p-4">
      <div className="flex justify-between items-center">
        <h2>Post Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-white-100 focus:outline-none">
          Close
        </button>
      </div>
      <h3>Comments</h3>
      <div className="comment-container h-64 my-2 overflow-auto scrollbar-webkit">
        {comments.map((comment) => (
          <div key={comment.commentid} className="bg-gray-800 rounded-md p-2 my-2 flex-start">
            <p>{comment.content}</p>
            <p>Comment by: {comment.user.username}</p>
            {currentUserId === comment.userid && (
              <button
                onClick={() => handleDeleteComment(comment.commentid)}
                className="text-red-500 ml-2"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full h-16 bg-gray-800 rounded-md p-2 text-white-100 focus:outline-none resize-none"
          placeholder="Enter your comment..."
        ></textarea>
        <button onClick={handleAddComment} className="mt-2 bg-blue-500 text-white-100 px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default PostDetails;
