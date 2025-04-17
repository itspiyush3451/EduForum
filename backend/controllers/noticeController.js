import { parse } from "path";
import {
  getAllNotices as getAllNoticesService,
  createNotice as createNoticeService, // Avoid conflict
  updateNotice as updateNoticeService,
  deleteNotice as deleteNoticeService,
  getUserNotices as getUserNoticesService,
} from "../services/noticeService.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createNotice = async (req, res) => {
  try {
    const notice = await createNoticeService(req);

    // Check if notice creation was successful
    if (!notice.success) {
      return res.status(400).json(notice);
    }

    res.status(201).json(notice);
  } catch (error) {
    console.error("Error creating notice:", error);
    res.status(500).json({
      success: false,
      message: "Error creating notice",
    });
  }
};

export const getAllNotices = async (req, res) => {
  try {
    const result = await getAllNoticesService(req.user.userid);
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    res.json(result.data);
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching notices",
      error: error.message 
    });
  }
};

export const getUserNotices = async (req, res) => {
  try {
    // const { userid } = req.query;

    const userid = req.user.userid;
    if (!userid) {
      return res
        .status(400)
        .json({ message: "User ID is required in query parameters" });
    }
    const userNotices = await getUserNoticesService(userid);
    res.json(userNotices);
  } catch (error) {
    console.error("Error fetching user notices:", error);
    res.status(500).json({ message: "Error fetching user notices" });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const noticeid = parseInt(req.params.noticeid, 10);
    const { title, content } = req.body;

    const updated = await updateNoticeService(noticeid, title, content);

    res.json(updated);
  } catch (error) {
    console.error("Error updating notice:", error);
    res.status(500).json({ message: "Error updating notice" });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const noticeid = parseInt(req.params.noticeid, 10);
    const result = await deleteNoticeService(noticeid);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    console.error("Error deleting notice:", error);
    res.status(500).json({ message: "Error deleting notice" });
  }
};

export const downloadAttachment = async (req, res) => {
  try {
    const { noticeId, filename } = req.params;
    
    // Construct the file path
    const filePath = path.join(__dirname, "../uploads", filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }

    // Set appropriate headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream the file to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Handle stream errors
    fileStream.on('error', (err) => {
      console.error("Error streaming file:", err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error streaming file",
          error: err.message
        });
      }
    });
  } catch (error) {
    console.error("Error in downloadAttachment:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to download attachment",
        error: error.message
      });
    }
  }
};
