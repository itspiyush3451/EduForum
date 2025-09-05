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
import { authorizeRole } from "../middlewares/authorizeRole.js";

router.post("/createpost", authenticateToken, createPost);

router.put("/:postid", authenticateToken, updatePost);

router.delete("/:postid", authenticateToken, deletePost);

router.get("/userposts", authenticateToken, getUserPosts);

router.get("/all", authenticateToken, getAllPosts);

// Admin Content Management - Get all posts with filtering
router.get(
  "/admin/all",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const {
        search,
        department,
        userType,
        dateRange,
        startDate,
        endDate,
        page = 1,
        limit = 50,
      } = req.query;

      // Build where clause
      let whereClause = {};

      // Search filter
      if (search) {
        whereClause.content = {
          contains: search,
          mode: "insensitive",
        };
      }

      // Department filter
      if (department && department !== "all") {
        whereClause.departmentid = parseInt(department);
      }

      // User type filter
      if (userType && userType !== "all") {
        whereClause.user = {
          usertype: userType.toUpperCase(),
        };
      }

      // Date range filter
      if (dateRange && dateRange !== "all") {
        const now = new Date();
        let startFilterDate;

        switch (dateRange) {
          case "today":
            startFilterDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case "week":
            startFilterDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case "month":
            startFilterDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case "custom":
            if (startDate) startFilterDate = new Date(startDate);
            break;
        }

        if (startFilterDate) {
          whereClause.timestamp = {
            gte: startFilterDate,
          };
        }

        if (dateRange === "custom" && endDate) {
          const endFilterDate = new Date(endDate);
          endFilterDate.setHours(23, 59, 59, 999);
          whereClause.timestamp = {
            ...whereClause.timestamp,
            lte: endFilterDate,
          };
        }
      }

      // Get posts with pagination
      const posts = await prisma.post.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              username: true,
              usertype: true,
            },
          },
          department: {
            select: {
              name: true,
            },
          },
          comments: {
            select: {
              commentid: true,
            },
          },
        },
        orderBy: {
          timestamp: "desc",
        },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      });

      // Get total count for pagination
      const totalCount = await prisma.post.count({
        where: whereClause,
      });

      res.json({
        success: true,
        data: {
          posts,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalCount,
            pages: Math.ceil(totalCount / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching admin posts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch posts",
      });
    }
  }
);

// Admin Bulk Post Actions
router.post(
  "/admin/bulk-action",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { action, postIds } = req.body;

      if (
        !action ||
        !postIds ||
        !Array.isArray(postIds) ||
        postIds.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Action and post IDs are required",
        });
      }

      let result;
      switch (action) {
        case "delete":
          // Use transaction to delete posts and related comments
          result = await prisma.$transaction(async (tx) => {
            // Delete related comments first
            await tx.comment.deleteMany({
              where: { postid: { in: postIds.map((id) => parseInt(id)) } },
            });
            // Delete posts
            return await tx.post.deleteMany({
              where: { postid: { in: postIds.map((id) => parseInt(id)) } },
            });
          });
          break;
        case "export":
          // Get posts for export
          const exportPosts = await prisma.post.findMany({
            where: { postid: { in: postIds.map((id) => parseInt(id)) } },
            include: {
              user: {
                select: {
                  username: true,
                  usertype: true,
                },
              },
              department: {
                select: {
                  name: true,
                },
              },
              comments: true,
            },
          });

          return res.json({
            success: true,
            message: "Posts exported successfully",
            data: exportPosts,
          });
        default:
          return res.status(400).json({
            success: false,
            message: "Invalid action",
          });
      }

      res.json({
        success: true,
        message: `Successfully ${action}d ${result.count} post(s)`,
        affectedCount: result.count,
      });
    } catch (error) {
      console.error("Error performing bulk action on posts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to perform bulk action",
      });
    }
  }
);

export default router; // Use default export
