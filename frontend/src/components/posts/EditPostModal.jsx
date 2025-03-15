import React, { useState } from "react";

const EditPostModal = ({ postId, initialContent, onSave, onCancel }) => {
  console.log(initialContent);
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    onSave(postId, content);
    // Close the modal after saving
    onCancel();
  };

  return (
    <div className="fixed top-44 left-0 w-full h-60 flex items-center justify-center rounded-lg drop-shadow-sm ">
      <div className="bg-gray-700 p-8 rounded-lg w-full mr-2">
        <h2 className="text-xl font-bold text-white-100 mb-4">Edit Post</h2>
        <textarea
          className="w-full h-40 border rounded-md p-2 mb-4 resize-none bg-gray-600 text-white-100"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="flex justify-end">
          <button
            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
