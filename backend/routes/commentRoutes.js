import express from "express";

const router = express.Router();
import {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

router.post("/", authenticateToken, createComment);

router.get("/post/:postid", getCommentsByPostId);

router.put("/:commentid", authenticateToken, updateComment);

router.delete("/:commentid", authenticateToken, deleteComment);

export default router; // Use default export
