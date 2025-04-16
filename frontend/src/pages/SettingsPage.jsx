import React from "react";
import SettingsContainer from "../components/settings/SettingsContainer";

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <SettingsContainer />
    </div>
  );
};

export default SettingsPage;
