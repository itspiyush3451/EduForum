import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotice } from "../../context/NoticeContext";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";
import { FaArrowLeft, FaEdit, FaTrash, FaFileAlt } from "react-icons/fa";

const NoticeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isTeacher } = useAuth();
  const { getNoticeById, deleteNotice } = useNotice();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const data = await getNoticeById(id);
        setNotice(data);
      } catch (err) {
        setError("Failed to load notice details");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id, getNoticeById]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await deleteNotice(id);
        navigate("/notices");
      } catch (err) {
        setError("Failed to delete notice");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  if (!notice) {
    return <div className="text-center py-8">Notice not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate("/notices")}
          className="flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Notices
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{notice.title}</h1>
            <p className="text-gray-600">
              Posted by {notice.author.name} on{" "}
              {new Date(notice.createdAt).toLocaleDateString()}
            </p>
          </div>
          {isTeacher && (
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => navigate(`/notices/edit/${id}`)}
                className="flex items-center gap-2"
              >
                <FaEdit /> Edit
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                className="flex items-center gap-2"
              >
                <FaTrash /> Delete
              </Button>
            </div>
          )}
        </div>

        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap">{notice.content}</p>
        </div>

        {notice.fileUrl && (
          <div className="mt-6">
            <a
              href={notice.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              <FaFileAlt /> View Attached File
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeDetails;
