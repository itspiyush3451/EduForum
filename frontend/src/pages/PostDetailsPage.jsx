// src/pages/PostDetailsPage.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import PostDetails from "../components/posts/PostDetails";
import Layout from "../components/layout/MainLayout";

const PostDetailsPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Post Details</title>
        <meta name="description" content="View post details" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <PostDetails />
      </div>
    </Layout>
  );
};

export default PostDetailsPage;
