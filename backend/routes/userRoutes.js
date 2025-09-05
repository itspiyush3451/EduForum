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

      // Delete all related records in a transaction
      await prisma.$transaction(async (tx) => {
        // Delete all posts by the user
        await tx.post.deleteMany({
          where: { userid: user.userid },
        });

        // Delete all comments by the user
        await tx.comment.deleteMany({
          where: { userid: user.userid },
        });

        // Delete all notices by the user
        await tx.notice.deleteMany({
          where: { userid: user.userid },
        });

        // Delete all invalidated tokens for the user
        await tx.invalidatedToken.deleteMany({
          where: { userid: user.userid },
        });

        // Finally, delete the user
        await tx.user.delete({
          where: { username },
        });
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
            name: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Transform the response to include department info
    const profileData = {
      ...user,
      departmentid: user.departmentid || user.department?.departmentid || null,
      departmentName: user.department?.name || null,
      department: undefined, // Remove the nested department object
    };

    res.json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
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
        message: "Username and email are required",
      });
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          userid: userId,
        },
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already taken by another user",
      });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { userid: userId },
      data: {
        username,
        email,
        departmentid: departmentId || null,
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
            name: true,
          },
        },
      },
    });

    // Transform the response to include department name
    const profileData = {
      ...updatedUser,
      departmentName: updatedUser.department?.name || null,
      department: undefined, // Remove the nested department object
    };

    res.json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user profile",
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
            name: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Transform the response to include department info
    const userData = {
      ...user,
      departmentid: user.departmentid || user.department?.departmentid || null,
      departmentName: user.department?.name || null,
      department: undefined, // Remove the nested department object
    };

    res.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
});

// Bulk User Operations Route
router.post(
  "/admin/users/bulk-action",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { action, userIds } = req.body;

      if (
        !action ||
        !userIds ||
        !Array.isArray(userIds) ||
        userIds.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Action and user IDs are required",
        });
      }

      let result;
      switch (action) {
        case "activate":
          // For now, we'll skip the isActive field until migration is complete
          result = { count: userIds.length };
          break;
        case "deactivate":
          // For now, we'll skip the isActive field until migration is complete
          result = { count: userIds.length };
          break;
        case "delete":
          // Use transaction for bulk delete with related records
          result = await prisma.$transaction(async (tx) => {
            // Delete related records first
            await tx.post.deleteMany({
              where: { userid: { in: userIds } },
            });
            await tx.comment.deleteMany({
              where: { userid: { in: userIds } },
            });
            await tx.notice.deleteMany({
              where: { userid: { in: userIds } },
            });
            await tx.invalidatedToken.deleteMany({
              where: { userid: { in: userIds } },
            });
            // Delete users
            return await tx.user.deleteMany({
              where: { userid: { in: userIds } },
            });
          });
          break;
        default:
          return res.status(400).json({
            success: false,
            message: "Invalid action",
          });
      }

      res.json({
        success: true,
        message: `Successfully ${action}d ${result.count} user(s)`,
        affectedCount: result.count,
      });
    } catch (error) {
      console.error("Error performing bulk action:", error);
      res.status(500).json({
        success: false,
        message: "Failed to perform bulk action",
      });
    }
  }
);

// Export Users Route
router.get(
  "/admin/users/export",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { format = "csv", filters } = req.query;

      let whereClause = {};
      if (filters) {
        const parsedFilters = JSON.parse(filters);
        if (parsedFilters.role && parsedFilters.role !== "all") {
          whereClause.usertype = parsedFilters.role.toUpperCase();
        }
        if (parsedFilters.department && parsedFilters.department !== "all") {
          whereClause.departmentid = parsedFilters.department;
        }
      }

      const users = await prisma.user.findMany({
        where: whereClause,
        select: {
          userid: true,
          username: true,
          email: true,
          usertype: true,
          departmentid: true,
          createdAt: true,
          department: {
            select: {
              name: true,
            },
          },
        },
      });

      if (format === "csv") {
        const csvHeader = "ID,Username,Email,Role,Department,Created At\n";
        const csvData = users
          .map(
            (user) =>
              `${user.userid},${user.username},${user.email},${user.usertype},${
                user.department?.name || "N/A"
              },${user.createdAt.toISOString()}`
          )
          .join("\n");

        const csvContent = csvHeader + csvData;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=users_export.csv"
        );
        res.send(csvContent);
      } else {
        res.json({
          success: true,
          data: users,
          total: users.length,
        });
      }
    } catch (error) {
      console.error("Error exporting users:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export users",
      });
    }
  }
);

// User Analytics Route
router.get(
  "/admin/users/analytics",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const [totalUsers, usersByRole, usersByDepartment, recentUsers] =
        await Promise.all([
          prisma.user.count(),
          prisma.user.groupBy({
            by: ["usertype"],
            _count: { usertype: true },
          }),
          prisma.user.groupBy({
            by: ["departmentid"],
            _count: { departmentid: true },
            where: { departmentid: { not: null } },
          }),
          prisma.user.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            select: {
              userid: true,
              username: true,
              email: true,
              usertype: true,
              createdAt: true,
              department: {
                select: { name: true },
              },
            },
          }),
        ]);

      // Get department names for analytics
      const departments = await prisma.department.findMany();
      const departmentMap = departments.reduce((acc, dept) => {
        acc[dept.departmentid] = dept.name;
        return acc;
      }, {});

      const analytics = {
        totalUsers,
        activeUsers: totalUsers, // For now, consider all users as active
        inactiveUsers: 0, // For now, no inactive users
        usersByRole: usersByRole.map((item) => ({
          role: item.usertype,
          count: item._count.usertype,
        })),
        usersByDepartment: usersByDepartment.map((item) => ({
          department: departmentMap[item.departmentid] || "Unknown",
          count: item._count.departmentid,
        })),
        recentUsers,
        growthRate: 0, // You can calculate this based on time periods
      };

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user analytics",
      });
    }
  }
);

export default router;
