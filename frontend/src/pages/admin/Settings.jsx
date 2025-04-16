import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminSidebar from "../../components/layout/AdminSidebar";
import AdminNavbar from "../../components/layout/AdminNavbar";

const Settings = () => {
  // Auth context for role verification
  const { isAdmin, user, loading: authLoading } = useContext(AuthContext);

  // State management
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      siteName: "EduForum",
      siteDescription: "Educational Discussion Platform",
      maintenanceMode: false,
      allowRegistration: true,
    },
    appearance: {
      theme: "light",
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      fontFamily: "Inter",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      notificationFrequency: "daily",
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordPolicy: "medium",
    },
  });

  // Loading state component
  const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Loading settings...</p>
      </div>
    </div>
  );

  // Show loading state while auth is initializing
  if (authLoading) {
    return <LoadingState />;
  }

  // Only redirect if we're sure the user is not an admin
  if (!authLoading && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSettingChange = (category, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log("Saving settings:", settings);
    // Show success message
    alert("Settings saved successfully!");
  };

  const tabs = [
    { id: "general", label: "General", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: "appearance", label: "Appearance", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-1.414 1.414M7 17h.01" },
    { id: "notifications", label: "Notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { id: "security", label: "Security", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        <main className={`flex-1 p-4 md:p-6 mt-16 ${isSidebarCollapsed ? 'ml-16' : 'ml-16 md:ml-64'} transition-all duration-300`}>
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your application settings</p>
            </div>

            {/* Settings Content */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                      </svg>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* General Settings */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                        Site Name
                      </label>
                      <input
                        type="text"
                        id="siteName"
                        value={settings.general.siteName}
                        onChange={(e) => handleSettingChange("general", "siteName", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                        Site Description
                      </label>
                      <textarea
                        id="siteDescription"
                        value={settings.general.siteDescription}
                        onChange={(e) => handleSettingChange("general", "siteDescription", e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="maintenanceMode"
                        checked={settings.general.maintenanceMode}
                        onChange={(e) => handleSettingChange("general", "maintenanceMode", e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                        Maintenance Mode
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowRegistration"
                        checked={settings.general.allowRegistration}
                        onChange={(e) => handleSettingChange("general", "allowRegistration", e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="allowRegistration" className="ml-2 block text-sm text-gray-700">
                        Allow New User Registration
                      </label>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === "appearance" && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                        Theme
                      </label>
                      <select
                        id="theme"
                        value={settings.appearance.theme}
                        onChange={(e) => handleSettingChange("appearance", "theme", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                        Primary Color
                      </label>
                      <input
                        type="color"
                        id="primaryColor"
                        value={settings.appearance.primaryColor}
                        onChange={(e) => handleSettingChange("appearance", "primaryColor", e.target.value)}
                        className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
                        Secondary Color
                      </label>
                      <input
                        type="color"
                        id="secondaryColor"
                        value={settings.appearance.secondaryColor}
                        onChange={(e) => handleSettingChange("appearance", "secondaryColor", e.target.value)}
                        className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700">
                        Font Family
                      </label>
                      <select
                        id="fontFamily"
                        value={settings.appearance.fontFamily}
                        onChange={(e) => handleSettingChange("appearance", "fontFamily", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Montserrat">Montserrat</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleSettingChange("notifications", "emailNotifications", e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                        Email Notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pushNotifications"
                        checked={settings.notifications.pushNotifications}
                        onChange={(e) => handleSettingChange("notifications", "pushNotifications", e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-700">
                        Push Notifications
                      </label>
                    </div>
                    <div>
                      <label htmlFor="notificationFrequency" className="block text-sm font-medium text-gray-700">
                        Notification Frequency
                      </label>
                      <select
                        id="notificationFrequency"
                        value={settings.notifications.notificationFrequency}
                        onChange={(e) => handleSettingChange("notifications", "notificationFrequency", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="realtime">Real-time</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="twoFactorAuth"
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => handleSettingChange("security", "twoFactorAuth", e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-700">
                        Enable Two-Factor Authentication
                      </label>
                    </div>
                    <div>
                      <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        id="sessionTimeout"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleSettingChange("security", "sessionTimeout", parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="passwordPolicy" className="block text-sm font-medium text-gray-700">
                        Password Policy
                      </label>
                      <select
                        id="passwordPolicy"
                        value={settings.security.passwordPolicy}
                        onChange={(e) => handleSettingChange("security", "passwordPolicy", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="low">Low (minimum 6 characters)</option>
                        <option value="medium">Medium (minimum 8 characters, numbers)</option>
                        <option value="high">High (minimum 12 characters, numbers, symbols)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handleSaveSettings}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center py-6 text-sm text-gray-500">
              <p>© {new Date().getFullYear()} EduForum. All rights reserved.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings; 