// backend/routes/authRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  getMyProfileController,
} =   require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/auth/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", protect, getMyProfileController);

module.exports = router;