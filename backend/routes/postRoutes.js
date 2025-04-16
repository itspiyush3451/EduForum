import express from "express";
const router = express.Router();
import {
  createPost,
  updatePost,
  getAllPosts,
  getUserPosts,
  deletePost,
} from "../controllers/postController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

router.post("/createpost", authenticateToken, createPost);

router.put("/:postid", authenticateToken, updatePost);

router.delete("/:postid", authenticateToken, deletePost);

router.get("/userposts", authenticateToken, getUserPosts);

router.get("/all", authenticateToken, getAllPosts);

export default router; // Use default export
