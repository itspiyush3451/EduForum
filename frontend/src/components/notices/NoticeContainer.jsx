import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const NoticeContainer = () => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null); // State to store the selected file

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userid;
  const isFaculty = decodedToken.userType === 'faculty';
  useEffect(() => {
    // Fetch notices from your backend server
    fetch("http://localhost:3000/api/notices", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setNotices(data); // Set the fetched notices to the state
      })
      .catch((error) => {
        console.error("Error fetching notices:", error);
      });
  }, []);

  const handleCreateNotice = () => {
    // Ensure the title and content are not empty
    if (title.trim() === "" || content.trim() === "") {
      alert("Please enter the title and content of the notice.");
      return;
    }

    // Create a new FormData object to send the notice data along with the file
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) {
      formData.append("file", file); // Append the file to the FormData if selected
    }

    // Send the new notice to the backend
    fetch("http://localhost:3000/api/notices", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    })
      .then((response) => {
        if (response.ok) {
          // If the notice was created successfully, refresh the notices list
          return response.json();
        } else {
          throw new Error("Failed to create notice.");
        }
      })
      .then(() => {
        // Clear the title, content, and file fields after successfully creating the notice
        setTitle("");
        setContent("");
        setFile(null);
        // Refresh the notices list
        refreshNotices();
      })
      .catch((error) => {
        console.error("Error creating notice:", error);
      });
  };

  const refreshNotices = () => {
    const token = localStorage.getItem("token");
    // Fetch notices from the backend server
    fetch("http://localhost:3000/api/notices", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setNotices(data); // Set the fetched notices to the state
      })
      .catch((error) => {
        console.error("Error fetching notices:", error);
      });
  };

  const handleFileChange = (e) => {
    // Update the file state when a file is selected
    setFile(e.target.files[0]);
  };

  const handleDownloadImage = async (filename) => {
    try {
      // Fetch the image data from the server
      const response = await fetch(`http://localhost:3000/uploads/${filename}`);
      if (!response.ok) {
        throw new Error("Failed to fetch image data");
      }

      // Convert the image data into a blob
      const blob = await response.blob();

      // Create a URL for the blob object
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = `notice_${filename}`;
      
      // Simulate a click on the anchor element to trigger the download
      a.click();
      
      // Revoke the URL to release memory
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <>
      <div className="mx-2 my-2 w-full drop-shadow-sm overflow-y-scroll scrollbar-webkit">
        {isFaculty && (<div className="flex bg-gray-700 mt-2 h-auto flex rounded-lg items-start justify-start mx-2">
          <div className="ml-4 grid grid-cols-1 w-full mr-2">
            <div>
              <input
                type="text"
                placeholder="Title"
                className="drop-shadow-sm my-2 px-2 py-2 h-8 w-full rounded-md border border-gray-800 bg-gray-800 text-white-100  focus:outline-none focus:ring ring-blue-500 focus:ring-opacity-50 mr-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* File input for selecting images or PDFs */}

            <textarea
              placeholder="Enter the content of the notice"
              className="drop-shadow-sm resize-none my-2 px-2 py-2 h-16 rounded-md border border-gray-800 bg-gray-800 text-white-100 w-full focus:outline-none focus:ring ring-blue-500 focus:ring-opacity-50"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex w-full justify-between items-center">
              <input
                type="file"
                accept="image/*" // Specify accepted file types
                onChange={handleFileChange}
                className="hidden" // Hide the original input
                multiple={false} // Allow only one file to be selected
                id="fileInput" // Add an ID to associate with the label
              />
              <label
                htmlFor="fileInput"
                className="drop-shadow-sm my-2 px-2 py-1 h-8  rounded-md border border-gray-800 bg-gray-800 text-white-100 focus:outline-none focus:ring ring-blue-500 focus:ring-opacity-50 cursor-pointer"
              >
                {file ? file.name : "Choose File"} {/* Display selected file name if any */}
              </label>
              <button
                className="text-white-100 rounded-lg h-8 mt-2 mr-4 w-32 bg-blue-100 mb-2 pb-2 pt-1 px-2 ml-5"
                onClick={handleCreateNotice}
              >
                Create Notice
              </button>
            </div>
          </div>
        </div>)}
        {notices.map((notice) => (
          <div className="grid grid-cols-1 mx-2">
            <div
              key={notice.noticeid}
              className="flex bg-gray-700 mt-2 h-28 rounded-lg  drop-shadow-sm "
            >
              <div className="ml-8 flex flex-col">
                <p className="mt-4 text-white-100 text-semibold">{notice.title}</p>
                <div className="mt-2 text-white-100">{notice.content}</div>
              </div>
              {/* Display the image on the right side */}
              {notice.filename && (
        <div className="flex flex-col ml-auto mt-2 mr-4">
          <img
            src={`http://localhost:3000/uploads/${notice.filename}`}
            alt="Notice Image"
            className="h-auto max-h-16  rounded-lg cursor-pointer"
          />
          <button
            className="text-white-100 px-2 bg-blue-500 h-10 mt-2 mb-2 rounded-lg"
            onClick={() => handleDownloadImage(notice.filename)}
          >
            Download
          </button>
        </div>
      )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NoticeContainer;
