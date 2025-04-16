import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNotice } from "../context/NoticeContext";

// Notice components
import CreateEditNoticeForm from "../components/notices/CreateEditNoticeForm";

const CreateEditNoticePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isTeacher } = useAuth();
  const { fetchNoticeById, loading } = useNotice();
  const isEditMode = !!id;

  // Redirect non-teachers or unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: isEditMode ? `/notices/edit/${id}` : "/notices/create" },
      });
    } else if (!isTeacher) {
      navigate("/notices");
    }
  }, [isAuthenticated, isTeacher, navigate, id, isEditMode]);

  // Fetch notice data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchNoticeById(id);
    }
  }, [isEditMode, id, fetchNoticeById]);

  if (!isAuthenticated || !isTeacher) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "Edit Notice" : "Create New Notice"}
      </h1>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <p className="text-blue-700">
          {isEditMode
            ? "You are editing an existing notice. All users who can view this notice will see your changes once saved."
            : "Create a new notice to share information with students and staff. You can specify who should receive this notice."}
        </p>
      </div>

      <CreateEditNoticeForm />
    </div>
  );
};

export default CreateEditNoticePage;
