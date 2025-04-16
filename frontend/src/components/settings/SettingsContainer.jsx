import React, { useState } from "react";
import ProfileForm from "./ProfileForm";
import PasswordChangeForm from "./PasswordChangeForm";

/**
 * Container component for user settings
 */
const SettingsContainer = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="bg-white shadow rounded-lg max-w-4xl mx-auto">
      {/* Settings Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === "password"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Change Password
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {activeTab === "profile" && <ProfileForm />}
        {activeTab === "password" && <PasswordChangeForm />}
      </div>
    </div>
  );
};

export default SettingsContainer;
