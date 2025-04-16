import express from "express";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import {
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  getUserNotices,
  downloadAttachment,
} from "../controllers/noticeController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create notice - using authorizeRole
router.post(
  "/create",
  authenticateToken,
  (req, res, next) => {
    console.log("User object:", req.user);
    next();
  },
  authorizeRole(["TEACHER"], ["ADMIN"]),
  createNotice
);

// Get all notices
router.get("/", authenticateToken, getAllNotices);

// Get notices of the logged-in user
router.get("/usernotices", authenticateToken, getUserNotices);

// Download notice attachment
router.get("/:noticeId/download/:filename", authenticateToken, downloadAttachment);

// Update notice (only teachers)
router.put(
  "/:noticeid",
  authenticateToken,
  authorizeRole(["TEACHER"], ["ADMIN"]),
  updateNotice
);
// Delete notice (only teachers)
router.delete(
  "/:noticeid",
  authenticateToken,
  authorizeRole(["TEACHER"], ["ADMIN"]),
  deleteNotice
);

export default router;
