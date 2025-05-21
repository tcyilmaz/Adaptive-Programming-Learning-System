// backend/routes/courseRoutes.js
const express = require("express");
const {
  getAllCourses,
  getCourseById,
  getQuestionsByCourse,
} = require("../controllers/courseController"); // Sadece courseController'dan import

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route("/")
    .get(getAllCourses);

router.route("/:courseId")
    .get(getCourseById);

router.route("/:courseId/questions")
    .get(protect, getQuestionsByCourse); // Bu rota getQuestionsByCourse'u kullanır

module.exports = router;