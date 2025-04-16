import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Absolute path
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init upload
const upload = multer({ storage: storage }).single("file");

export async function createNotice(req) {
  return new Promise((resolve, reject) => {
    upload(req, null, async (err) => {
      if (err) {
        return reject({
          success: false,
          message: "Error uploading file",
        });
      }

      try {
        const { title, content } = req.body;
        const userid = req.user.userid;
        const filename = req.file ? req.file.filename : null;

        // Validate input
        if (!title || !content) {
          return resolve({
            success: false,
            message: "Title and content are required",
          });
        }

        // Verify user exists and department details
        const user = await prisma.user.findUnique({
          where: { userid: userid },
          select: { departmentid: true },
        });

        // Check if user exists
        if (!user) {
          return resolve({
            success: false,
            message: "User not found",
          });
        }

        // Validate department exists
        const department = await prisma.department.findUnique({
          where: { departmentid: user.departmentid },
        });

        if (!department) {
          return resolve({
            success: false,
            message: "Invalid department",
          });
        }

        // Create the notice
        const notice = await prisma.notice.create({
          data: {
            title,
            content,
            userid,
            filename,
            departmentid: user.departmentid, // Use user's department
          },
        });

        resolve({
          success: true,
          data: notice,
        });
      } catch (error) {
        console.error("Detailed notice creation error:", error);
        resolve({
          success: false,
          message: "Error creating notice",
          error: error.message,
        });
      }
    });
  });
}

export async function getAllNotices(userid) {
  try {
    // Get user's department
    const user = await prisma.user.findUnique({
      where: { userid },
      select: { departmentid: true }
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const notices = await prisma.notice.findMany({
      where: {
        departmentid: user.departmentid
      },
      include: {
        user: {
          select: {
            username: true,
            userid: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    return { success: true, data: notices };
  } catch (error) {
    console.error("Error in getAllNotices:", error);
    return { success: false, message: "Error fetching notices", error: error.message };
  }
}

export async function getUserNotices(userid) {
  try {
    if (!userid) {
      return { success: false, message: "User ID is required" };
    }
    const userNotices = await prisma.notice.findMany({
      where: { userid },
      include: {
        user: {
          select: { username: true },
        },
      },
    });
    return { success: true, data: userNotices };
  } catch (error) {
    return { success: false, message: "Error fetching user notices" };
  }
}

export async function updateNotice(noticeid, title, content) {
  try {
    const updatedNotice = await prisma.notice.update({
      where: { noticeid },
      data: { title, content },
    });

    return {
      success: true,
      message: "Notice updated successfully",
      data: updatedNotice,
    };
  } catch (error) {
    return { success: false, message: "Error updating notice" };
  }
}

export async function deleteNotice(noticeid) {
  try {
    await prisma.notice.delete({
      where: { noticeid },
    });

    return { success: true, message: "Notice deleted successfully" };
  } catch (error) {
    return { success: false, message: "Error deleting notice" };
  }
}
