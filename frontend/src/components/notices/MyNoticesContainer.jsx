import React, { useState, useEffect } from "react";
import useAuth from "../../context/AuthContext";
import useNotice from "../../hooks/useNotice";

// Replacing UI components with standard React elements
// since I don't see the shadcn/ui components in your structure
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Spinner from "../../components/common/Spinner";

// Using built-in icons from your project structure
// Note: You may need to import these properly
import { PlusIcon, SearchIcon, RefreshCw, Pencil, Trash2 } from "lucide-react";

const MyNoticeContainer = () => {
  const { user } = useAuth();
  const {
    userNotices: notices,
    loading,
    error,
    isTeacher,
    fetchUserNotices,
    updateNotice,
    deleteNotice,
  } = useNotice();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  // Fetch notices on mount
  useEffect(() => {
    fetchUserNotices();
  }, [fetchUserNotices]);

  // Filter notices based on search term
  const filteredNotices = notices
    ? notices.filter(
        (notice) =>
          notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notice.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Refresh notices
  const handleRefresh = () => {
    fetchUserNotices();
  };

  // Navigate to create notice page
  const handleCreateNotice = () => {
    window.location.href = "/notices/create";
  };

  // Open delete confirmation dialog
  const confirmDelete = (notice) => {
    setNoticeToDelete(notice);
    setDeleteDialogOpen(true);
  };

  // Execute notice deletion
  const handleDelete = async () => {
    if (noticeToDelete) {
      await deleteNotice(noticeToDelete.noticeid);
      setDeleteDialogOpen(false);
      setNoticeToDelete(null);
    }
  };

  // Toggle notice importance
  const toggleImportance = async (notice) => {
    await updateNotice(notice.noticeid, {
      ...notice,
      important: !notice.important,
    });
  };

  // Navigate to edit page
  const handleEdit = (noticeId) => {
    window.location.href = `/notices/edit/${noticeId}`;
  };

  // Show message if not a teacher
  if (!isTeacher) {
    return (
      <div className="p-8 text-center border rounded-md">
        <h2 className="text-xl font-semibold mb-2">Teacher Access Only</h2>
        <p className="text-gray-500">
          Only teachers can view and manage their notices.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Notices</h2>
          <Button disabled>
            <span className="mr-2">+</span> Create Notice
          </Button>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full border rounded-md p-4 mb-4">
            <Spinner />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h2 className="text-lg font-semibold text-red-700">Error</h2>
        <p className="text-red-600">{error}</p>
        <Button onClick={handleRefresh} className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Notices</h2>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-xs"
          />
          <Button onClick={handleRefresh} className="px-3">
            Refresh
          </Button>
          <Button onClick={handleCreateNotice}>Create Notice</Button>
        </div>
      </div>

      {filteredNotices.length === 0 ? (
        <div className="p-8 text-center border rounded-md">
          <p className="text-lg text-gray-500">
            You haven't created any notices yet.
          </p>
          <Button onClick={handleCreateNotice} className="mt-4">
            Create Your First Notice
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div key={notice.noticeid} className="w-full border rounded-md p-4">
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">{notice.title}</h3>
                  <div className="flex space-x-2">
                    {notice.important && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        Important
                      </span>
                    )}
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {notice.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">
                  Posted on {formatDate(notice.createdat)}
                  {notice.updatedat !== notice.createdat &&
                    ` (Updated on ${formatDate(notice.updatedat)})`}
                </p>
              </div>
              <div className="mb-4">
                {notice.content.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-2">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="flex justify-between">
                <Button
                  className="border border-gray-300 bg-white text-gray-700"
                  onClick={() => toggleImportance(notice)}
                >
                  {notice.important ? "Remove Important" : "Mark Important"}
                </Button>
                <div className="flex space-x-2">
                  <Button
                    className="border border-gray-300 bg-white text-gray-700"
                    onClick={() => handleEdit(notice.noticeid)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-600 text-white"
                    onClick={() => confirmDelete(notice)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <Modal
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          title="Are you sure?"
        >
          <div className="p-4">
            <p>
              This will permanently delete the notice "{noticeToDelete?.title}".
              This action cannot be undone.
            </p>
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                className="border border-gray-300 bg-white text-gray-700"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button className="bg-red-600 text-white" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyNoticeContainer;
