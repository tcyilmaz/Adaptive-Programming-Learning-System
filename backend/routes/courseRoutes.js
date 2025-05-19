const express = require('express');
const router = express.Router();
const {
    getAllCourses,
    getNextQuestion
} = require('../controllers/courseController.js'); // Make sure .js extension if your controller file has it
const { protect } = require('../middleware/authMiddleware.js'); // Make sure .js extension

// @route   GET api/courses
// @desc    Get all available courses
// @access  Protected (User must be logged in)
router.get('/', protect, getAllCourses);

// @route   GET api/courses/:courseId/next-question
// @desc    Get the next question for a specific course for the logged-in user
// @access  Protected
router.get('/:courseId/next-question', protect, getNextQuestion);

// Add more course-related routes here later if needed, e.g.:
// GET api/courses/:courseId - Get details for a single course (if you implement a Course Detail Page)
// POST api/courses - Create a new course (Admin only)
// PUT api/courses/:courseId - Update a course (Admin only)
// DELETE api/courses/:courseId - Delete a course (Admin only)

module.exports = router;