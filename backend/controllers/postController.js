import * as postService from "../services/postService.js";

export async function createPost(req, res) {
  try {
    const { content, title, tags, departmentid } = req.body;
    const { userid } = req.user;

    // Validate that departmentid is provided and is a number
    if (!departmentid) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required",
      });
    }

    // Convert departmentid to number
    const departmentIdNum = Number(departmentid);
    if (isNaN(departmentIdNum)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID format",
      });
    }

    const post = await postService.createPost(content, userid, departmentIdNum);

    if (!post.success) {
      return res.status(403).json(post);
    }

    res.status(201).json(post);
  } catch (err) {
    console.error("Error Creating Post:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function updatePost(req, res) {
  try {
    const postid = parseInt(req.params.postid, 10);
    const { content, title, departmentid } = req.body;
    const { userid, usertype } = req.user;
    
    const post = await postService.updatePost(postid, userid, usertype, content, title, departmentid);
    
    if (!post.success) {
      return res.status(404).json(post);
    }
    
    res.status(200).json({
      success: true,
      data: post.data,
      message: "Post updated successfully",
    });
  } catch (err) {
    console.error("Error updating Post:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function deletePost(req, res) {
  try {
    const postid = parseInt(req.params.postid, 10);

    const { userid } = req.user;
    const deleted = await postService.deletePost(postid, userid);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting Post:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getUserPosts(req, res) {
  try {
    const { userid } = req.user;
    const userPosts = await postService.getUserPosts(userid);
    res.json(userPosts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ message: "Error fetching user posts" });
  }
}

export async function getAllPosts(req, res) {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
}
