import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { noticeService } from "../services/noticeService";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";

// Create the context
const NoticeContext = createContext();

// Custom hook for using the notice context
export const useNotice = () => {
  const context = useContext(NoticeContext);
  if (!context) {
    throw new Error("useNotice must be used within a NoticeProvider");
  }
  return context;
};

// Provider component
export const NoticeProvider = ({ children }) => {
  // State
  const [notices, setNotices] = useState([]);
  const [userNotices, setUserNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentNotice, setCurrentNotice] = useState(null);
  const [fileDownloadError, setFileDownloadError] = useState(null);
  
  // Refs
  const hasFetched = useRef(false);
  const isFetching = useRef(false);

  // Get auth context for user role checking
  const { user } = useAuth();

  // Check if user is a teacher
  const isTeacher = user?.role === "TEACHER";

  // Fetch all notices with debounce
  const fetchNotices = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await noticeService.getAllNotices();
      if (response.success) {
        setNotices(response.data);
        setError(null);
      } else {
        setError(response.message || "Failed to fetch notices");
      }
    } catch (err) {
      console.error("Error fetching notices:", err);
      setError(err.message || "Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Fetch user's notices (for teachers)
  const fetchUserNotices = useCallback(async () => {
    if (!isTeacher) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await noticeService.getUserNotices();
      if (response.success && Array.isArray(response.data)) {
        setUserNotices(response.data);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch your notices");
      console.error("Error fetching user notices:", err);
    } finally {
      setLoading(false);
    }
  }, [isTeacher]);

  // Create new notice
  const createNotice = useCallback(async (formData) => {
    setLoading(true);
    try {
      // Always use the user's department ID
      if (!user?.departmentid) {
        throw new Error("User must be assigned to a department");
      }

      // Add the user's department ID to the form data as a number
      formData.append('departmentid', Number(user.departmentid));

      const response = await noticeService.createNotice(formData);
      if (response.success) {
        setNotices(prev => [response.data, ...prev]);
        setError(null);
        return response.data;
      } else {
        throw new Error(response.message || "Failed to create notice");
      }
    } catch (err) {
      console.error("Error creating notice:", err);
      setError(err.message || "Failed to create notice");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.departmentid]);

  // Update notice
  const updateNotice = useCallback(async (id, formData) => {
    setLoading(true);
    try {
      // Get current notice to check department
      const currentNotice = notices.find(n => n.noticeid === id);
      if (!currentNotice) {
        throw new Error("Notice not found");
      }

      // Ensure department cannot be changed
      if (formData.departmentid && formData.departmentid !== currentNotice.departmentid) {
        throw new Error("Department cannot be changed");
      }

      const response = await noticeService.updateNotice(id, formData);
      if (response.success) {
        setNotices(prev => prev.map(notice => 
          notice.noticeid === id ? response.data : notice
        ));
        setError(null);
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update notice");
      }
    } catch (err) {
      console.error("Error updating notice:", err);
      setError(err.message || "Failed to update notice");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notices]);

  // Delete a notice (teachers only)
  const deleteNotice = async (noticeId) => {
    if (!isTeacher) {
      setError("Only teachers can delete notices");
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const success = await noticeService.deleteNotice(noticeId);

      // Update local state upon successful deletion
      if (success) {
        setNotices((prevNotices) =>
          prevNotices.filter((notice) => notice.noticeid !== noticeId)
        );

        setUserNotices((prevUserNotices) =>
          prevUserNotices.filter((notice) => notice.noticeid !== noticeId)
        );

        // Clear current notice if it was deleted
        if (currentNotice && currentNotice.noticeid === noticeId) {
          setCurrentNotice(null);
        }
      }

      return success;
    } catch (err) {
      setError(err.message || "Failed to delete notice");
      console.error("Error deleting notice:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Set a notice as current (for editing or viewing details)
  const setNoticeForEdit = (notice) => {
    setCurrentNotice(notice);
  };

  // Clear current notice
  const clearCurrentNotice = () => {
    setCurrentNotice(null);
  };

  // Download a notice attachment
  const downloadAttachment = async (noticeId, filename) => {
    setFileDownloadError(null);
    try {
      const blob = await noticeService.downloadAttachment(noticeId, filename);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setFileDownloadError(err.message || "Failed to download file");
      console.error("Error downloading attachment:", err);
    }
  };

  // Stable context value with minimal dependencies
  const contextValue = useMemo(
    () => ({
      notices,
      userNotices,
      loading,
      error,
      fileDownloadError,
      currentNotice,
      fetchNotices,
      fetchUserNotices,
      createNotice,
      updateNotice,
      deleteNotice,
      downloadAttachment,
      setNoticeForEdit,
      clearCurrentNotice,
      isTeacher,
    }),
    [
      notices,
      userNotices,
      loading,
      error,
      fileDownloadError,
      currentNotice,
      fetchNotices,
      fetchUserNotices,
      isTeacher,
    ]
  );

  return (
    <NoticeContext.Provider value={contextValue}>
      {children}
    </NoticeContext.Provider>
  );
};
NoticeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NoticeContext;
