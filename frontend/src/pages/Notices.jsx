import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Notice components
import NoticeContainer from "../components/notices/NoticeContainer";
import MyNoticesContainer from "../components/notices/MyNoticesContainer";
import NoticeDetails from "../components/notices/NoticeDetails";
import CreateEditNoticeForm from "../components/notices/CreateEditNoticeForm";

const NoticesList = React.memo(({ isAuthenticated, isTeacher, selectedTab, onTabChange }) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Notices</h1>

      {isTeacher && (
        <div className="mb-6">
          <button
            className={`px-4 py-2 mr-2 rounded ${
              selectedTab === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => onTabChange("all")}
          >
            All Notices
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedTab === "my"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => onTabChange("my")}
          >
            My Notices
          </button>
        </div>
      )}

      {isTeacher ? (
        selectedTab === "all" ? (
          <NoticeContainer />
        ) : (
          <MyNoticesContainer />
        )
      ) : (
        <NoticeContainer />
      )}

      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
          <p className="text-blue-700">
            Sign in to get personalized notifications and reminders
            about important notices.
          </p>
        </div>
      )}
    </>
  );
});

const Notices = () => {
  const { isAuthenticated, isTeacher } = useAuth();
  const [selectedTab, setSelectedTab] = useState("all");

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <Routes>
        {/* Notice details page */}
        <Route path="view/:id" element={<NoticeDetails />} />

        {/* Create new notice (teachers only) */}
        <Route
          path="create"
          element={
            isTeacher ? (
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Create New Notice</h1>
                <CreateEditNoticeForm />
              </div>
            ) : (
              <Navigate to="/notices" replace />
            )
          }
        />

        {/* Edit notice (teachers only) */}
        <Route
          path="edit/:id"
          element={
            isTeacher ? (
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Edit Notice</h1>
                <CreateEditNoticeForm />
              </div>
            ) : (
              <Navigate to="/notices" replace />
            )
          }
        />

        {/* Main notices listing page */}
        <Route
          index
          element={
            <NoticesList
              isAuthenticated={isAuthenticated}
              isTeacher={isTeacher}
              selectedTab={selectedTab}
              onTabChange={handleTabChange}
            />
          }
        />

        {/* Catch any other notice routes and redirect */}
        <Route path="*" element={<Navigate to="/notices" replace />} />
      </Routes>
    </div>
  );
};

export default Notices;
