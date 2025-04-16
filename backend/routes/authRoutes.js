import express from "express";
import passport from "../middlewares/authGoogle.js"; // Ensure this path is correct

const router = express.Router();

// Route to initiate Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route to handle Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // console.log("User session after login:", req.session); // Log session
    res.redirect("http://localhost:5173/dashboard"); // Redirect to dashboard or home
  }
);

export default router;
