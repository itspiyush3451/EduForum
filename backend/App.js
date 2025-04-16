import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { cleanupExpiredTokens } from "./services/userService.js";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import passport from "./middlewares/authGoogle.js"; // Import Passport config
import authRoutes from "./routes/authRoutes.js"; // Import OAuth routes
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import { fileURLToPath } from "url";
import ensureUploadsDir from "./ensureUploadsDir.js";
// console.log("Loading routes...");
// Load environment variables
dotenv.config();

// Initialize uploads directory
await ensureUploadsDir();

// Manually define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup PostgreSQL session store
const pgSession = connectPgSimple(session);
const pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const app = express();

// Middleware Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Session Configuration (Only ONE Instance)
app.use(
  session({
    store: new pgSession({ pool: pgPool }),
    secret: process.env.SESSION_SECRET || "fallback_secret", // Added fallback for safety
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, //process.env.NODE_ENV === "production", // Secure cookies only in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    },
  })
);

// Initialize Passport for Google OAuth
app.use(passport.initialize());
app.use(passport.session());

// Serve Static Files (Uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.get("/api/test", (req, res) => {
  // console.log("Test route hit");
  res.json({ message: "Server is working" });
  // Remove the next() call
});

// Add this to App.js at the top of your routes section
// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });
// API Routes
app.use("/api/auth", authRoutes); // OAuth routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
// console.log("Loading routes...");
app.use("/api/notices", noticeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/departments", departmentRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
  next();
});
// Load Swagger JSON
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "docs/swagger.json"), "utf8")
);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Schedule token cleanup - runs every day
setInterval(async () => {
  console.log("Cleaning up expired tokens...");
  await cleanupExpiredTokens();
}, 24 * 60 * 60 * 1000); // 24 hours
// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
