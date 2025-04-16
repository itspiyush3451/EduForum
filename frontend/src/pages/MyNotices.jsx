import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Layout components
import MainLayout from "../components/layout/MainLayout";

// Notice components
import MyNoticeContainer from "../components/notices/MyNoticesContainer";
import NoticeDetails from "../components/notices/NoticeDetails";
import CreateEditNoticeForm from "../components/notices/CreateEditNoticeForm";

// UI components
import Button from "../components/common/Button";
import { PlusIcon } from "lucide-react";

const MyNotices = () => {
  const { isAuthenticated, isTeacher, user } = useAuth();
  const navigate = useNavigate();

  // Redirect non-teachers to the main notices page
  useEffect(() => {
    if (isAuthenticated && !isTeacher) {
      navigate("/notices");
    } else if (!isAuthenticated) {
      navigate("/login", { state: { from: "/my-notices" } });
    }
  }, [isAuthenticated, isTeacher, navigate]);

  if (!isAuthenticated || !isTeacher) {
    return null; // Don't render anything while redirecting
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Routes>
          {/* View notice details */}
          <Route path="/view/:id" element={<NoticeDetails />} />

          {/* Create new notice */}
          <Route path="/create" element={<CreateEditNoticeForm />} />

          {/* Edit notice */}
          <Route path="/edit/:id" element={<CreateEditNoticeForm />} />

          {/* Main "my notices" listing */}
          <Route
            path="/"
            element={
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold">My Notices</h1>
                  <Button onClick={() => navigate("/my-notices/create")}>
                    <PlusIcon className="mr-2 h-4 w-4" /> Create Notice
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <p className="text-blue-700">
                    This page shows only notices that you have created. You can
                    create, edit, and manage your notices here.
                  </p>
                </div>

                <MyNoticeContainer />
              </>
            }
          />

          {/* Catch any other routes and redirect */}
          <Route path="*" element={<Navigate to="/my-notices" replace />} />
        </Routes>
      </div>
    </MainLayout>
  );
};

export default MyNotices;
