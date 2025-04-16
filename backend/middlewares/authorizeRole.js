// import { error } from "console";

const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.usertype)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Only ${allowedRoles.join(
          ", "
        )} roles are allowed to access this resource`,
      });
    }
    next();
  };
};

// Helper function to check if user is an admin
const isAdmin = (req) => {
  return req.user.usertype === "ADMIN";
};

export { authorizeRole, isAdmin };
