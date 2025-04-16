import React from "react";
import UserProfileComponent from "../components/user/UserProfileComponent";

const UserProfilePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <UserProfileComponent />
    </div>
  );
};

export default UserProfilePage;
