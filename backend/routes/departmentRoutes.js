import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

// Create a new department (Admin only)
router.post("/", authenticateToken, authorizeRole(["ADMIN"]), createDepartment);

// Get all departments (Public access for signup)
router.get("/", getAllDepartments);

// Get a single department by ID
router.get("/:departmentId", authenticateToken, getDepartmentById);

// Update a department (Admin only)
router.put(
  "/:departmentId",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  updateDepartment
);

// Delete a department (Admin only)
router.delete(
  "/:departmentId",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  deleteDepartment
);

export default router;
