import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getToken(req) {
  const authHeader = req.headers["authorization"];
  return authHeader && authHeader.split(" ")[1];
}

const authenticateToken = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Token not found" });
  }

  try {
    // Check if token is blacklisted
    const invalidatedToken = await prisma.invalidatedToken.findUnique({
      where: { token },
    });

    if (invalidatedToken) {
      return res.status(401).json({
        success: false,
        message: "Token has been invalidated, please login again",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { userid: decoded.userid },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error Authenticating Token:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }

    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export { authenticateToken };
