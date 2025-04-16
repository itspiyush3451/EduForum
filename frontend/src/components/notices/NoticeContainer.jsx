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
  FaDownload as Download,
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
    <Box sx={{ p: 4, bgcolor: "grey.50", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
          {isTeacher && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateNotice}
              startIcon={<PlusIcon />}
            >
              Create Notice
            </Button>
          )}
        </Box>

        {/* Notices Grid */}
        <Grid container spacing={3}>
          {notices.map((notice, index) => (
            <Grid item xs={12} key={notice.noticeid}>
              <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card
                  sx={{
                    position: "relative",
                    overflow: "visible",
                    boxShadow: notice.important ? "0 0 0 2px #ef4444" : "none",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  {notice.important && (
                    <Chip
                      icon={<ImportantIcon size="small" />}
                      label="Important"
                      color="error"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -12,
                        right: 16,
                        zIndex: 1,
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ color: "primary.main", fontWeight: 600 }}>
                      {notice.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Posted by {userNames[notice.userid] || 'Unknown Teacher'} • 
                      Department: {departments[notice.departmentid]?.name || 'Unknown Department'} • 
                      {notice.timestamp ? format(new Date(notice.timestamp), 'MMM d, yyyy h:mm a') : 'Date not available'}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
                      {notice.content}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary", fontSize: "0.875rem" }}>
                      <Typography variant="body2">
                        {notice.filename && (
                          <Paper
                            elevation={0}
                            sx={{
                              mt: 2,
                              p: 2,
                              bgcolor: "grey.50",
                              border: "1px solid",
                              borderColor: "grey.200",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <FileText className="text-gray-500" />
                              <Typography variant="body2" color="text.secondary">
                                {notice.filename}
                              </Typography>
                            </Box>
                            <IconButton
                              onClick={() => downloadAttachment(notice.noticeid, notice.filename)}
                              color="primary"
                              size="small"
                            >
                              <Download />
                            </IconButton>
                          </Paper>
                        )}
                      </Typography>
                    </Box>
                  </CardContent>

                  {isTeacher && (
                    <CardActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: "flex-end", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(notice.noticeid)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(notice.noticeid)}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  )}
                </Card>
              </Fade>
            </Grid>
          ))}

          {notices.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
                <Typography variant="h6" color="text.secondary">
                  No notices found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  There are no notices to display
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default NoticeContainer;
