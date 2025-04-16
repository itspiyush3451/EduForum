import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const signUpSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(5, "Password must be at least 5 characters"),
  usertype: z.enum(["STUDENT", "TEACHER", "ADMIN"], {
    errorMap: () => ({ message: "Invalid user role" }),
  }),
  departmentid: z.number().nullable(),
}).refine(
  (data) => {
    // For ADMIN, departmentid should be null
    if (data.usertype === "ADMIN") {
      return data.departmentid === null;
    }
    // For STUDENT and TEACHER, departmentid should be a number greater than 0
    return typeof data.departmentid === 'number' && data.departmentid > 0;
  },
  {
    message: "Department is required for students and teachers",
    path: ["departmentid"]
  }
);

const changePasswordSchema = z.object({
  oldPassword: z.string().min(5),
  newPassword: z.string().min(5),
});

const changeEmailSchema = z.object({
  newEmail: z.string().email(),
});

export async function signUp(
  email,
  username,
  password,
  usertype = "STUDENT",
  departmentid = null
) {
  try {
    // Ensure usertype is uppercase
    usertype = usertype.toUpperCase();
    
    // Prepare data for validation
    const signupData = {
      email: email.trim(),
      username: username.trim(),
      password: password,
      usertype: usertype,
      departmentid: usertype === "ADMIN" ? null : Number(departmentid)
    };
    
    console.log("Signup data before validation:", signupData);
    
    // Parse and validate the input
    const validatedData = signUpSchema.safeParse(signupData);
    
    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      return { 
        success: false, 
        message: validatedData.error.errors.map(err => err.message).join(", ")
      };
    }
    
    console.log("Validated signup data:", validatedData.data);

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({ 
      where: { email: validatedData.data.email } 
    });
    
    if (existingEmail) {
      return { success: false, message: "Email already in use" };
    }

    // Validate department for students and teachers
    if (validatedData.data.usertype !== "ADMIN") {
      const department = await prisma.department.findUnique({
        where: { departmentid: validatedData.data.departmentid },
      });

      if (!department) {
        return { success: false, message: "Invalid department selected" };
      }
    }

    // Create the user
    const hashedPassword = await bcrypt.hash(validatedData.data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: validatedData.data.email,
        username: validatedData.data.username,
        password: hashedPassword,
        usertype: validatedData.data.usertype,
        departmentid: validatedData.data.departmentid,
      },
    });

    return { 
      success: true, 
      message: "User created successfully",
      user: {
        id: user.userid,
        email: user.email,
        username: user.username,
        usertype: user.usertype,
        departmentid: user.departmentid
      }
    };
  } catch (error) {
    console.error("Error during sign-up:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors.map((err) => err.message).join(", "),
      };
    }
    return {
      success: false,
      message: error.message || "An error occurred during sign-up",
    };
  }
}

export async function signIn(identifier, password) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { success: false, message: "Invalid email or password" };
    }

    // If user signed up with Google, they shouldn't enter a password
    if (user.googleId) {
      return { success: false, message: "Use Google OAuth to log in" };
    }
    const token = jwt.sign(
      { username: user.username, userType: user.usertype, userid: user.userid },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { success: true, message: "Login successful", token };
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, message: "An error occurred during login" };
  }
}

export async function changePassword(userid, oldPassword, newPassword) {
  try {
    changePasswordSchema.parse({ oldPassword, newPassword });

    const user = await prisma.user.findUnique({ where: { userid } });
    // console.log("User found:", !!user);
    if (!user) return { success: false, message: "User not found" };

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    // console.log("Password match:", passwordMatch);
    if (!passwordMatch) {
      return { success: false, message: "Incorrect old password" };
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { userid },
      data: { password: hashedNewPassword },
    });

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors.map((err) => err.message).join(", "),
      };
    }
    console.error("Error changing password:", error);
    return {
      success: false,
      message: "An error occurred while changing password",
    };
  }
}

export async function changeEmail(userid, newEmail) {
  try {
    changeEmailSchema.parse({ newEmail });

    const user = await prisma.user.findUnique({ where: { userid } });
    if (!user) return { success: false, message: "User not found" };

    const existingEmail = await prisma.user.findUnique({
      where: { email: newEmail },
    });
    if (existingEmail)
      return { success: false, message: "Email is already registered" };

    await prisma.user.update({
      where: { userid },
      data: { email: newEmail },
    });

    return { success: true, message: "Email changed successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors.map((err) => err.message).join(", "),
      };
    }
    console.error("Error changing email:", error);
    return {
      success: false,
      message: "An error occurred while changing email",
    };
  }
}

export async function invalidateToken(token, userid) {
  try {
    // Decode the token to get its expiration time
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiresAt = new Date(decoded.exp * 1000); // Convert UNIX timestamp to Date

    // Add the token to the blacklist
    await prisma.invalidatedToken.create({
      data: {
        token,
        userid: userid,
        expiresAt,
      },
    });

    return { success: true, message: "Token invalidated successfully" };
  } catch (error) {
    console.error("Error invalidating token:", error);
    return { success: false, message: "Failed to invalidate token" };
  }
}

// Optional: Add a cleanup function to remove expired tokens
export async function cleanupExpiredTokens() {
  try {
    const now = new Date();
    await prisma.invalidatedToken.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
    return { success: true, message: "Expired tokens cleaned up" };
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
    return { success: false, message: "Failed to clean up expired tokens" };
  }
}
