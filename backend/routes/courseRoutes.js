// backend/routes/courseRoutes.js
const express = require("express");
const {
  getAllCourses,
  getCourseById,
  getQuestionsByCourse, 
  // getNextQuestion // Şimdilik buradan kaldırabilir veya questionRoutes.js'e taşıyabiliriz
} = require("../controllers/courseController");

const { protect } = require('../middleware/authMiddleware'); 
// const { protect } = require('../middleware/authMiddleware'); // Kurslar public ise gerek yok

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public (veya Private)
router.route("/").get(getAllCourses);

// @route   GET /api/courses/:courseId
// @desc    Get a single course by ID
// @access  Public (veya Private)
router.route("/:courseId").get(getCourseById);

// @route   GET /api/courses/:courseId/next-question  (İLERİDE EKLENEBİLİR)
// @desc    Get the next question for a user in a specific course
// @access  Private
// router.route("/:courseId/next-question") // Bu rota daha mantıklı olabilir
//     .get(protect, getNextQuestion);       // 'protect' middleware'i ile korunmalı
router.route("/:courseId/questions")
    .get(protect, getQuestionsByCourse);

module.exports = router;
