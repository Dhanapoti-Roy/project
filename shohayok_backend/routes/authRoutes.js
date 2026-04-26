const express = require("express");
const router = express.Router();

const {
  register,
  login,
  refresh,
  logout,
  me,
  forgotPassword,
  verifyOtp,
  resetPassword
} = require("../controllers/authController");

const authenticate = require("../middleware/authenticate");

// ✅ Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// 🔥 NEW PASSWORD RESET ROUTES
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// ✅ Protected routes
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

module.exports = router;