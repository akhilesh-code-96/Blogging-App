import React, { useState } from "react";
import axios from "axios";

const DeletePost = ({ uid, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true); // Show loading state

    try {
      await axios.post("/api/delete-blog", { uid }, {
        headers: { "Content-Type": "application/json" },
      });
      onDelete(true);
    } catch (error) {
      console.error("Failed to delete the post", error);
      onDelete(false);
    } finally {
      setIsDeleting(false); // Hide loading state after success or failure
    }
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      handleDelete();
    } else {
      setIsDeleting(false); // Close dialog if user cancels
    }
  };

  return (
    <div className="flex items-center">
      <button
        className="flex items-center text-gray-500 hover:text-gray-700"
        onClick={() => setIsDeleting(true)}
        disabled={isDeleting} // Disable button while deleting
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7L10 16l-5-5" />
        </svg>
        <span className="ml-1 text-sm">Delete</span>
      </button>

      {/* Dialog with Confirmation Buttons */}
      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this post?</h2>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => handleConfirmation(false)}
              >
                No
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleConfirmation(true)}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletePost;
