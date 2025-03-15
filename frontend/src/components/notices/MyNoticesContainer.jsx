import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import EditNoticeModal from "./EditNoticeModal";

const MyNoticesContainer = () => {
  const [myNotices, setMyNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user's notices from the backend server
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userid;
    fetch(`http://localhost:3000/api/notices/?userid=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMyNotices(data); // Set the fetched notices to the state
      })
      .catch((error) => {
        console.error("Error fetching user's notices:", error);
      });
  }, []);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedNotice(null);
  };

  // Function to handle deleting a notice
  const handleDeleteNotice = (noticeId) => {
    // Send a DELETE request to the backend to delete the notice
    const token = localStorage.getItem("token");
    console.log(noticeId);
    fetch(`http://localhost:3000/api/notices/${noticeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // If the notice was deleted successfully, remove it from the state
          setMyNotices(
            myNotices.filter((notice) => notice.noticeid !== noticeId)
          );
        } else {
          throw new Error("Failed to delete notice.");
        }
      })
      .catch((error) => {
        console.error("Error deleting notice:", error);
      });
  };

  // Function to handle editing a notice
  const handleEditNotice = (noticeId, title, content) => {
    setSelectedNotice({ noticeId, title, content });
    setIsEditing(true);
  };

  const handleSaveEdit = (noticeId, newTitle, newContent) => {
    // Send a PUT request to update the notice
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/notices/${noticeId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle, content: newContent }),
    })
      .then((response) => {
        if (response.ok) {
          // Update the notice title and content in the state
          const updatedNotices = myNotices.map((notice) => {
            if (notice.noticeid === noticeId) {
              return { ...notice, title: newTitle, content: newContent };
            }
            return notice;
          });
          setMyNotices(updatedNotices);
          // Close the edit modal
          handleCancelEdit();
        } else {
          throw new Error("Failed to update notice.");
        }
      })
      .catch((error) => {
        console.error("Error updating notice:", error);
      });
  };

  return (
    <div className="mx-2 my-2 w-full drop-shadow-sm overflow-y-scroll scrollbar-webkit ">
      {myNotices.map((notice) => (
        <div
          key={notice.noticeid}
          className="flex bg-gray-700 mt-2 rounded-lg drop-shadow-sm mr-2 cursor-pointer"
        >
          <div className="ml-8 flex-grow ">
            <h2 className="mt-4 text-white-100 text-semibold text-md">
              Title : {notice.title}
            </h2>
            <p className="mt-2 text-white-100 mb-4">
              Content : {notice.content}
            </p>
          </div>
          <div className="flex items-center mr-2 text-white-100">
            <button
              className="text-white rounded-lg bg-blue-500 py-2 px-4 mr-2"
              onClick={() =>
                handleEditNotice(notice.noticeid, notice.title, notice.content)
              }
            >
              Edit
            </button>
            <button
              className="rounded-lg bg-red-500 py-2 px-4"
              onClick={() => handleDeleteNotice(notice.noticeid)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {isEditing && selectedNotice && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-500">
          <EditNoticeModal
            noticeId={selectedNotice.noticeId}
            initialTitle={selectedNotice.title}
            initialContent={selectedNotice.content}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        </div>
      )}
    </div>
  );
};

export default MyNoticesContainer;
