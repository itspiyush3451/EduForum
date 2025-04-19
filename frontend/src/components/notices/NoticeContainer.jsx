import React, { useState, useEffect, useMemo, useRef } from "react";
import useNotice from "../../hooks/useNotice";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Spinner from "../common/Spinner";
import {
  FaPlus as PlusIcon,
  FaSync as RefreshCw,
  FaPencilAlt as Pencil,
  FaTrashAlt as Trash2,
  FaFileAlt as FileText,
  FaDownload as DownloadIcon,
  FaExclamationCircle as ImportantIcon,
  FaImage,
  FaEdit as EditIcon,
  FaTrash as DeleteIcon,
} from "react-icons/fa";
import { userService } from "../../services/userService";
import { noticeService } from '../../services/noticeService';
import { format } from 'date-fns';
import { NOTICE_IMPORTANCE } from '../../constants/noticeConstants';
import { Box, Card, CardContent, Typography, Grid, CardActions, IconButton, Chip, Paper, Fade, Divider } from '@mui/material';
import { departmentService } from '../../services/departmentService';

const NoticeContainer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    notices = [],
    loading,
    error,
    isTeacher,
    fetchNotices: fetchNoticesFromHook,
    updateNotice,
    deleteNotice,
    downloadAttachment,
  } = useNotice();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [userNames, setUserNames] = useState({});
  const [departments, setDepartments] = useState({});

  // Ref to track initial fetch
  const hasInitialFetch = useRef(false);

  useEffect(() => {
    const fetchUserNames = async () => {
      if (!notices || notices.length === 0) return;
      
      // Fetch user names for all unique user IDs
      const uniqueUserIds = [...new Set(notices.map(notice => notice.userid))];
      const namePromises = uniqueUserIds.map(async (userId) => {
        try {
          const userResponse = await userService.getUserById(userId);
          return { userId, name: userResponse.data.username };
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          return { userId, name: 'Unknown Teacher' };
        }
      });
      
      const userNamesData = await Promise.all(namePromises);
      const namesMap = userNamesData.reduce((acc, { userId, name }) => {
        acc[userId] = name;
        return acc;
      }, {});
      
      setUserNames(namesMap);
    };

    const fetchDepartments = async () => {
      if (!notices || notices.length === 0) return;

      try {
        // Get unique department IDs from notices
        const uniqueDeptIds = [...new Set(notices.map(notice => notice.departmentid))];
        
        // Fetch departments in parallel
        const departmentPromises = uniqueDeptIds.map(async (deptId) => {
          try {
            const response = await departmentService.getDepartmentById(deptId);
            return response;
          } catch (error) {
            console.error(`Error fetching department ${deptId}:`, error);
            return null; // Return null for failed fetches
          }
        });

        const departments = await Promise.all(departmentPromises);
        // Filter out any null values from failed fetches
        const validDepartments = departments.filter(dept => dept !== null);
        setDepartments(validDepartments);
      } catch (error) {
        console.error("Error in fetchDepartments:", error);
        setDepartments([]); // Set empty array on error
      }
    };

    fetchUserNames();
    fetchDepartments();
  }, [notices]);

  // Initial fetch
  useEffect(() => {
    if (!hasInitialFetch.current) {
      hasInitialFetch.current = true;
      fetchNoticesFromHook();
    }
  }, [fetchNoticesFromHook]);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchNoticesFromHook();
  };

  // Handlers
  const handleCreateNotice = () => navigate("/notices/create");

  const confirmDelete = (notice) => {
    setNoticeToDelete(notice);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async (noticeId) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      await deleteNotice(noticeId);
      fetchNoticesFromHook();
    }
  };

  const toggleImportance = async (notice) => {
    await updateNotice(notice.noticeid, {
      ...notice,
      important: !notice.important,
    });
  };

  const handleEdit = (noticeId) => {
    navigate(`/notices/edit/${noticeId}`);
  };

  const handleDownload = async (noticeId) => {
    try {
      await downloadAttachment(noticeId);
    } catch (error) {
      console.error('Error downloading attachment:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ width: "60%" }} className="animate-pulse bg-gray-200 h-12 rounded" />
            <Box sx={{ width: "30%" }} className="animate-pulse bg-gray-200 h-10 rounded" />
          </Box>
          {[1, 2, 3].map((i) => (
            <Card key={i} sx={{ mb: 3, p: 2 }} className="animate-pulse">
              <Box sx={{ height: 24, width: "75%", bgcolor: "grey.200", borderRadius: 1, mb: 2 }} />
              <Box sx={{ height: 60, width: "100%", bgcolor: "grey.200", borderRadius: 1 }} />
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ bgcolor: 'error.light', borderLeft: 4, borderColor: 'error.main', p: 2, borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ImportantIcon className="text-red-400 mr-2" />
            <Box>
              <Typography variant="subtitle1" color="error">
                Error Loading Notices
              </Typography>
              <Typography variant="body2" color="error">
                {error}
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={handleRefresh}
                sx={{ mt: 2 }}
              >
                Try Again
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            {/* <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notices</h1> */}
            {/* <p className="mt-2 text-gray-600 dark:text-gray-400">
              Stay updated with the latest announcements and important information
            </p> */}
          </div>
          {isTeacher && (
            <button
              onClick={handleCreateNotice}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Create Notice
            </button>
          )}
        </div>

        {/* Notices Grid */}
        <div className="space-y-6">
          {notices.map((notice, index) => (
            <div
              key={notice.noticeid}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
                notice.important ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="p-6">
                {/* Notice Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {notice.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {userNames[notice.userid] || 'Unknown Teacher'}
                      </span>
                      <span className="mx-2">·</span>
                      <span>
                        {notice.timestamp ? format(new Date(notice.timestamp), 'MMM d, yyyy') : 'Date not available'}
                      </span>
                    </div>
                  </div>
                  {notice.important && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      Important
                    </span>
                  )}
                </div>

                {/* Notice Content */}
                <div className="mt-4">
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {notice.content}
                  </p>
                </div>

                {/* Department Info - Only show if department exists */}
                {departments[notice.departmentid]?.name && (
                  <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {departments[notice.departmentid].name}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {notice.filename && (
                      <button
                        onClick={() => downloadAttachment(notice.noticeid, notice.filename)}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <DownloadIcon className="h-4 w-4 mr-1" />
                        Download Attachment
                      </button>
                    )}
                  </div>
                  {isTeacher && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(notice.noticeid)}
                        className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <EditIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(notice.noticeid)}
                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <DeleteIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {notices.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No notices found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                There are no notices to display at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeContainer;
