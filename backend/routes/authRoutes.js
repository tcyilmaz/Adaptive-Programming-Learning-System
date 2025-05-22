const express = require("express");
const {
  registerUser,
  loginUser,
  getMyProfileController,
} =   require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { verifyRecaptcha } = require('../middleware/captchaVerify');

const router = express.Router();

router.post("/register", verifyRecaptcha, registerUser);

router.post("/login", verifyRecaptcha, loginUser);

router.get("/me", protect, getMyProfileController);

module.exports = router;