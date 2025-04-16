import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import Spinner from "../common/Spinner";

/**
 * Component for displaying user profile information
 */
const UserProfileComponent = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const data = await userService.getUserProfile();
        setProfileData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="p-4">Please log in to view your profile.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  // Use profile data if available, otherwise fall back to user context data
  const displayData = profileData || user;

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="mb-4 md:mb-0 md:mr-6">
          {/* Avatar/Profile Image */}
          <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-4xl">
            {displayData.username
              ? displayData.username.charAt(0).toUpperCase()
              : "U"}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">
            {displayData.username || "User"}
          </h2>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1">{displayData.email || "No email provided"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Role</h3>
              <p className="mt-1">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {displayData.usertype || "User"}
                </span>
              </p>
            </div>

            {displayData.departmentName && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Department
                </h3>
                <p className="mt-1">{displayData.departmentName}</p>
              </div>
            )}

            {displayData.createdAt && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Member Since
                </h3>
                <p className="mt-1">
                  {new Date(displayData.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <a
              href="/settings"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileComponent;
