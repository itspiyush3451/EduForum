import express from "express";
import { PrismaClient } from "@prisma/client";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  handleSignUp,
  handleSignIn,
  handleChangePassword,
  handleChangeEmail,
  logout,
} from "../controllers/userController.js";

// Create a single Prisma client instance
const prisma = new PrismaClient();
const router = express.Router();

// User Registration Routes
router.post("/signup", async (req, res) => {
  try {
    console.log("Signup Request Body:", req.body);
    await handleSignUp(req, res);
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred during sign-up",
    });
  }
});

// User Authentication Routes
router.post("/login", async (req, res) => {
  try {
    await handleSignIn(req, res);
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
});

// User Profile Management Routes
router.put("/changepassword", authenticateToken, async (req, res) => {
  try {
    await handleChangePassword(req, res);
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while changing password",
    });
  }
});

router.post("/changeemail", authenticateToken, async (req, res) => {
  try {
    await handleChangeEmail(req, res);
  } catch (err) {
    console.error("Change Email Error:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while changing email",
    });
  }
});

// Logout Route
router.post("/logout", authenticateToken, logout);

// Admin User Management Routes
router.get(
  "/admin/users",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          userid: true,
          username: true,
          email: true,
          usertype: true,
          departmentid: true,
        },
      });
      res.json({ success: true, users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve users",
      });
    }
  }
);

// Update User Role Route
router.put(
  "/admin/user/:username/role",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { username } = req.params;
      const { newRole } = req.body;

      // Validate role
      const validRoles = ["STUDENT", "TEACHER", "ADMIN"];
      if (!validRoles.includes(newRole)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user role",
        });
      }

      // First, check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { username },
        select: { userid: true, username: true },
      });

      if (!existingUser) {
        console.error(
          `Attempted to update role for non-existent user: ${username}`
        );
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Proceed with update
      const updatedUser = await prisma.user.update({
        where: { username },
        data: { usertype: newRole },
        select: {
          userid: true,
          username: true,
          usertype: true,
          email: true,
        },
      });

      res.json({
        success: true,
        message: "User role updated successfully",
        user: {
          userid: updatedUser.userid,
          username: updatedUser.username,
          newRole: updatedUser.usertype,
          email: updatedUser.email,
        },
      });
    } catch (error) {
      console.error("Error updating user role:", {
        error: error.message,
        code: error.code,
        username: req.params.username,
        newRole: req.body.newRole,
      });

      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update user role",
      });
    }
  }
);

// Delete User Route
router.delete(
  "/admin/user/:username",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { username } = req.params;

      // First, find the user to ensure they exist and get their details
      const user = await prisma.user.findUnique({
        where: { username },
        select: { userid: true, username: true },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Proceed with deletion
      await prisma.user.delete({
        where: { username },
      });

      res.json({
        success: true,
        message: "User deleted successfully",
        user: {
          userid: user.userid,
          username: user.username,
        },
      });
    } catch (error) {
      console.error("Error deleting user:", {
        error: error.message,
        code: error.code,
        username: req.params.username,
      });

      // Handle specific Prisma errors
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete user",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

// Get User Profile Route
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userid: req.user.userid },
      select: {
        userid: true,
        username: true,
        email: true,
        usertype: true,
        departmentid: true,
        createdAt: true,
        department: {
          select: {
            departmentid: true,
            name: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Transform the response to include department info
    const profileData = {
      ...user,
      departmentid: user.departmentid || user.department?.departmentid || null,
      departmentName: user.department?.name || null,
      department: undefined // Remove the nested department object
    };

    res.json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile"
    });
  }
});

// Update User Profile Route
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { username, email, departmentId } = req.body;
    const userId = req.user.userid;

    // Validate input
    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: "Username and email are required"
      });
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          userid: userId
        }
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already taken by another user"
      });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { userid: userId },
      data: {
        username,
        email,
        departmentid: departmentId || null
      },
      select: {
        userid: true,
        username: true,
        email: true,
        usertype: true,
        departmentid: true,
        createdAt: true,
        department: {
          select: {
            name: true
          }
        }
      }
    });

    // Transform the response to include department name
    const profileData = {
      ...updatedUser,
      departmentName: updatedUser.department?.name || null,
      department: undefined // Remove the nested department object
    };

    res.json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user profile"
    });
  }
});

// Get User by ID Route
router.get("/admin/user/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { userid: id },
      select: {
        userid: true,
        username: true,
        email: true,
        usertype: true,
        departmentid: true,
        createdAt: true,
        department: {
          select: {
            departmentid: true,
            name: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Transform the response to include department info
    const userData = {
      ...user,
      departmentid: user.departmentid || user.department?.departmentid || null,
      departmentName: user.department?.name || null,
      department: undefined // Remove the nested department object
    };

    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user"
    });
  }
});

export default router;
