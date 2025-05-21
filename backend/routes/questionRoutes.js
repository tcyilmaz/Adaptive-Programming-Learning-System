// backend/routes/questionRoutes.js
const express = require('express');
const { submitAnswer } = require('../controllers/questionController'); // Doğru controller'dan import
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Bu rota /api/questions/:questionId/submit_answer şeklinde olacak
router.route('/:questionId/submit_answer')
    .post(protect, submitAnswer);

module.exports = router;