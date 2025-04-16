import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createPost(content, userid, departmentid) {
  try {
    // Verify user exists and belongs to the department
    const user = await prisma.user.findUnique({
      where: { userid: userid },
      select: { departmentid: true },
    });

    // Check if user exists
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Check if user belongs to the specified department
    if (Number(user.departmentid) !== Number(departmentid)) {
      return {
        success: false,
        message: "You can only create posts in your own department",
      };
    }

    // Validate department exists
    const department = await prisma.department.findUnique({
      where: { departmentid: departmentid },
    });

    if (!department) {
      return {
        success: false,
        message: "Invalid department",
      };
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        content,
        userid,
        departmentid,
      },
    });

    return {
      success: true,
      data: post,
    };
  } catch (err) {
    console.error("Error Creating Post:", err);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}

export async function updatePost(postid, userid, usertype, content, title, departmentid) {
  try {
    const post = await prisma.post.findUnique({
      where: { postid },
    });

    if (!post) {
      return { success: false, message: "Post not found" };
    }

    // Check authorization
    if (post.userid !== userid && usertype !== "ADMIN" && usertype !== "TEACHER") {
      return { success: false, message: "Unauthorized to update this post" };
    }

    // Verify department exists if departmentid is provided
    if (departmentid) {
      const department = await prisma.department.findUnique({
        where: { departmentid: Number(departmentid) },
      });
      if (!department) {
        return { success: false, message: "Invalid department" };
      }
    }

    const updateData = {
      content,
      ...(title && { title }),
      ...(departmentid && { departmentid: Number(departmentid) }),
    };

    const updatedPost = await prisma.post.update({
      where: { postid },
      data: updateData,
      include: { user: { select: { username: true } } },
    });

    return {
      success: true,
      data: updatedPost,
      message: "Post updated successfully",
    };
  } catch (err) {
    console.error("Error updating Post:", err);
    return { success: false, message: "Internal server error" };
  }
}

export async function deletePost(postid, userid) {
  try {
    const post = await prisma.post.findUnique({
      where: { postid },
    });

    if (!post) {
      return { success: false, message: "Post not found" };
    }

    if (
      post.userid !== userid &&
      post.usertype !== "ADMIN" &&
      post.usertype !== "TEACHER"
    ) {
      return { success: false, message: "Post not found or unauthorized" };
    }

    await prisma.post.delete({ where: { postid } });

    return { success: true, message: "Post deleted successfully" };
  } catch (err) {
    console.error("Error deleting Post:", err);
    return { success: false, message: "Internal server error" };
  }
}

export async function getUserPosts(userid) {
  try {
    const userPosts = await prisma.post.findMany({
      where: { userid },
      include: { user: { select: { username: true } } },
      orderBy: { timestamp: 'desc' }
    });

    return { success: true, data: userPosts };
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return { success: false, message: "Error fetching user posts" };
  }
}

export async function getAllPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: { user: { select: { username: true } } },
      orderBy: { timestamp: 'desc' }
    });

    return { success: true, data: posts };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { success: false, message: "Error fetching posts" };
  }
}
