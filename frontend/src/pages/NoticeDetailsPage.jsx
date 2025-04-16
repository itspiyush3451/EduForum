import React from "react";
import NoticeDetails from "../components/notices/NoticeDetails";
import { CommentProvider } from "../context/CommentContext";
import MainLayout from "../components/layout/MainLayout";

const NoticeDetailsPage = () => {
  return (
    <MainLayout>
      <CommentProvider>
        <NoticeDetails />
      </CommentProvider>
    </MainLayout>
  );
};

export default NoticeDetailsPage;
