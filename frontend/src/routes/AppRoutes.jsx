import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import MainLayout from "../components/layout/MainLayout";
import { PostProvider } from "../context/PostContext";
import { DepartmentProvider } from "../context/DepartmentContext";
import { NoticeProvider } from "../context/NoticeContext";

// Import auth pages
import LoginPage from "../pages/LoginPage";
import StudentSignupPage from "../pages/StudentSignupPage";
import TeacherSignupPage from "../pages/TeacherSignupPage";
import AdminSignupPage from "../pages/AdminSignupPage";
import Dashboard from "../pages/Dashboard";

// Import post-related pages
import AllPosts from "../pages/AllPosts";
import MyPosts from "../pages/MyPosts";
import CreateEditPostPage from "../pages/CreateEditPostPage";
import PostDetailsPage from "../pages/PostDetailsPage";

// Import notice-related pages
import Notices from "../pages/Notices";
import MyNotices from "../pages/MyNotices";
import NoticeDetailsPage from "../pages/NoticeDetailsPage";
import CreateEditNoticePage from "../pages/CreateEditNoticePage";

// Import profile and settings pages
import Settings from "../pages/SettingsPage";
import UserProfilePage from "../pages/UserProfilePage";

// Import admin pages
import AdminDashboard from "../pages/AdminDashboard";
import UserManagementPage from "../pages/UserManagementPage";
import DepartmentManagementPage from "../pages/DepartmentManagementPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Navigate to="/signup/student" replace />} />
      <Route path="/signup/student" element={<StudentSignupPage />} />
      <Route path="/signup/teacher" element={<TeacherSignupPage />} />
      <Route path="/signup/admin" element={<AdminSignupPage />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route
          element={
            <DepartmentProvider>
              <PostProvider>
                <NoticeProvider>
                  <MainLayout />
                </NoticeProvider>
              </PostProvider>
            </DepartmentProvider>
          }
        >
          {/* Regular user routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/posts/create" element={<CreateEditPostPage />} />
          <Route path="/posts/:postId" element={<PostDetailsPage />} />
          <Route path="/posts/:postId/edit" element={<CreateEditPostPage />} />
          <Route path="/posts/all" element={<AllPosts />} />
          <Route path="/posts/my-posts" element={<MyPosts />} />
          <Route path="/notices/*" element={<Notices />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/settings" element={<Settings />} />

          {/* Teacher-only routes */}
          <Route element={<PrivateRoute allowedRoles={["TEACHER", "ADMIN"]} />}>
            <Route path="/my-notices" element={<MyNotices />} />
          </Route>
        </Route>
      </Route>

      {/* Admin Routes - No MainLayout wrapper */}
      <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/departments" element={<DepartmentManagementPage />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch-all redirect for unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
