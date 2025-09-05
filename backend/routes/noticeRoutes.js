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
router.get(
  "/:noticeId/download/:filename",
  authenticateToken,
  downloadAttachment
);

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

// Admin Content Management - Get all notices with filtering
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
        whereClause.OR = [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: search,
              mode: "insensitive",
            },
          },
        ];
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

      // Get notices with pagination
      const notices = await prisma.notice.findMany({
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
        },
        orderBy: {
          timestamp: "desc",
        },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      });

      // Get total count for pagination
      const totalCount = await prisma.notice.count({
        where: whereClause,
      });

      res.json({
        success: true,
        data: {
          notices,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalCount,
            pages: Math.ceil(totalCount / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching admin notices:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch notices",
      });
    }
  }
);

// Admin Bulk Notice Actions
router.post(
  "/admin/bulk-action",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { action, noticeIds } = req.body;

      if (
        !action ||
        !noticeIds ||
        !Array.isArray(noticeIds) ||
        noticeIds.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Action and notice IDs are required",
        });
      }

      let result;
      switch (action) {
        case "delete":
          // Delete notices
          result = await prisma.notice.deleteMany({
            where: { noticeid: { in: noticeIds.map((id) => parseInt(id)) } },
          });
          break;
        case "export":
          // Get notices for export
          const exportNotices = await prisma.notice.findMany({
            where: { noticeid: { in: noticeIds.map((id) => parseInt(id)) } },
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
            },
          });

          return res.json({
            success: true,
            message: "Notices exported successfully",
            data: exportNotices,
          });
        default:
          return res.status(400).json({
            success: false,
            message: "Invalid action",
          });
      }

      res.json({
        success: true,
        message: `Successfully ${action}d ${result.count} notice(s)`,
        affectedCount: result.count,
      });
    } catch (error) {
      console.error("Error performing bulk action on notices:", error);
      res.status(500).json({
        success: false,
        message: "Failed to perform bulk action",
      });
    }
  }
);

// Admin Content Analytics
router.get(
  "/admin/analytics",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const [
        totalNotices,
        noticesByDepartment,
        noticesByUserType,
        recentNotices,
      ] = await Promise.all([
        prisma.notice.count(),
        prisma.notice.groupBy({
          by: ["departmentid"],
          _count: { departmentid: true },
        }),
        prisma.notice.groupBy({
          by: ["userid"],
          _count: { userid: true },
        }),
        prisma.notice.findMany({
          take: 5,
          orderBy: { timestamp: "desc" },
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
        totalNotices,
        noticesByDepartment: noticesByDepartment.map((item) => ({
          department: departmentMap[item.departmentid] || "Unknown",
          count: item._count.departmentid,
        })),
        recentNotices,
        todayNotices: await prisma.notice.count({
          where: {
            timestamp: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
      };

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error("Error fetching notice analytics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch notice analytics",
      });
    }
  }
);

export default router;
