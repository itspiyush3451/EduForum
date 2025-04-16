import {
  signUp,
  signIn,
  changePassword,
  changeEmail,
  invalidateToken,
} from "../services/userService.js";

// Controller function to handle user sign-up
export async function handleSignUp(req, res) {
  try {
    const { email, username, password, usertype, departmentid } = req.body;
    console.log("Signup request data:", { email, username, usertype, departmentid });
    
    const result = await signUp(
      email,
      username,
      password,
      usertype,
      departmentid
    );
    
    console.log("Signup result:", result);
    
    if (!result) {
      return res.status(500).json({
        success: false,
        message: "No response received from signup service"
      });
    }
    
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error("Signup controller error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred during sign-up"
    });
  }
}

// Controller function to handle user sign-in
export async function handleSignIn(req, res) {
  const { identifier, password } = req.body;
  const result = await signIn(identifier, password);
  res.status(result.success ? 200 : 401).json(result);
}

// Controller function to handle password change
export async function handleChangePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  const result = await changePassword(
    req.user.userid,
    oldPassword,
    newPassword
  );
  res.status(result.success ? 200 : 400).json(result);
}

// Controller function to handle email change
export async function handleChangeEmail(req, res) {
  try {
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({
        success: false,
        message: "New email is required",
      });
    }

    const result = await changeEmail(req.user.userid, newEmail);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error changing email:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

//controller function to handle logout
export async function logout(req, res) {
  try {
    // Get the token from the request
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token provided",
      });
    }

    // Invalidate the token
    const result = await invalidateToken(token, req.user.userid);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to logout",
      });
    }

    // If using sessions for any other purpose, you can destroy the session too
    if (req.session) {
      req.session.destroy();
    }

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
}
