// commentService.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createComment(content, postid, userid, departmentid) {
  try {
    // Validate user
    const user = await prisma.user.findUnique({
      where: { userid },
      select: { departmentid: true, usertype: true },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Validate post exists and belongs to the same department
    const post = await prisma.post.findUnique({
      where: { postid },
      select: { departmentid: true },
    });

    if (!post) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    // Check if user's department matches the post's department
    if (user.departmentid !== post.departmentid) {
      return {
        success: false,
        message: "You can only comment on posts within your department",
      };
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postid,
        userid,
        departmentid: post.departmentid, // Use post's department
      },
      include: {
        user: {
          select: {
            username: true,
            usertype: true,
          },
        },
      },
    });

    return {
      success: true,
      data: comment,
    };
  } catch (error) {
    console.error("Error in commentService.createComment:", error);
    return {
      success: false,
      message: "Error creating comment",
      error: error.message,
    };
  }
}

export async function updateComment(commentid, userid, usertype, content) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { commentid: Number(commentid) },
      include: {
        user: {
          select: {
            username: true,
            usertype: true,
          },
        },
      },
    });

    if (!comment) {
      return { success: false, message: "Comment not found" };
    }

    if (
      comment.userid !== userid &&
      usertype !== "ADMIN" &&
      usertype !== "TEACHER"
    ) {
      return { success: false, message: "Unauthorized to update this comment" };
    }

    const updatedComment = await prisma.comment.update({
      where: { commentid: Number(commentid) },
      data: { content },
      include: {
        user: {
          select: {
            username: true,
            usertype: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Comment updated successfully",
      data: updatedComment,
    };
  } catch (error) {
    console.error("Error updating comment:", error);
    return { success: false, message: "Internal server error" };
  }
}

export async function deleteComment(commentid, userid, usertype) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { commentid: Number(commentid) },
    });

    if (!comment) {
      return { success: false, message: "Comment not found" };
    }

    if (
      comment.userid !== userid &&
      usertype !== "ADMIN" &&
      usertype !== "TEACHER"
    ) {
      return { success: false, message: "Unauthorized to delete this comment" };
    }

    await prisma.comment.delete({
      where: { commentid: Number(commentid) },
    });

    return { success: true, message: "Comment deleted successfully" };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { success: false, message: "Internal server error" };
  }
}

export async function getCommentsByPostId(postid) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postid: Number(postid) },
      include: {
        user: {
          select: {
            username: true,
            usertype: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}
