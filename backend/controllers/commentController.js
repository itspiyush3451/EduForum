// commentController.js
import * as commentService from "../services/commentService.js";

export async function createComment(req, res) {
  try {
    const { content, postid, departmentid } = req.body;
    const userid = req.user.userid;
    const usertype = req.user.usertype;

    // Validate input
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    // Ensure postid is a valid number
    const postIdNum = Number(postid);
    if (isNaN(postIdNum)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const comment = await commentService.createComment(
      content,
      postIdNum,
      userid,
      departmentid
    );

    // Check if comment creation was successful
    if (!comment.success) {
      return res.status(400).json(comment);
    }

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: comment.data,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({
      success: false,
      message: "Error creating comment",
    });
  }
}

export async function updateComment(req, res) {
  try {
    const commentid = parseInt(req.params.commentid, 10);
    const { content } = req.body;
    const userid = req.user.userid;
    const usertype = req.user.usertype;

    const result = await commentService.updateComment(commentid, userid, usertype, content);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: "Comment updated successfully",
      comment: result.data,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ success: false, message: "Error updating comment" });
  }
}

export async function deleteComment(req, res) {
  try {
    const commentid = parseInt(req.params.commentid, 10);
    const userid = req.user.userid;
    const usertype = req.user.usertype;

    const result = await commentService.deleteComment(commentid, userid, usertype);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Error deleting comment" });
  }
}

export async function getCommentsByPostId(req, res) {
  try {
    const postid = parseInt(req.params.postid, 10);
    const comments = await commentService.getCommentsByPostId(postid);

    res.json({
      success: true,
      comments: comments
    });
  } catch (error) {
    console.error("Error fetching comments by postId:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching comments by postId" 
    });
  }
}
