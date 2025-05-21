// backend/controllers/questionController.js
const db = require("../config/db");

// @desc    Submit an answer for a question and check if it's correct
// @route   POST /api/questions/:questionId/submit_answer
// @access  Private
const submitAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { answer: userAnswer } = req.body;
    const userId = req.user.id; // authMiddleware'den (protect) gelmeli

    if (userAnswer === undefined || userAnswer === null) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Answer is required in the request body.",
        });
    }

    const questionResult = await db.query(
      "SELECT question_id, question_type, correct_answer, options FROM questions WHERE question_id = $1",
      [questionId]
    );

    if (questionResult.rows.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: `Question not found with ID: ${questionId}`,
        });
    }

    const question = questionResult.rows[0];
    let isCorrect = false;

    if (question.question_type === "MCQ") {
      isCorrect =
        userAnswer.toString().trim() ===
        question.correct_answer.toString().trim();
    } else if (question.question_type === "FillBlank") {
      isCorrect =
        userAnswer.toString().trim().toLowerCase() ===
        question.correct_answer.toString().trim().toLowerCase();
    }

    // TODO: user_progress tablosunu güncelle
    console.log(
      `User ${userId} answered question ${questionId}. Correct: ${isCorrect}. User answer: ${userAnswer}, Correct answer: ${question.correct_answer}`
    );

    res.status(200).json({
      success: true,
      isCorrect: isCorrect,
      correctAnswer: question.correct_answer,
    });
  } catch (error) {
    console.error(
      `Error submitting answer for question (${req.params.questionId}):`,
      error
    );
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while submitting answer",
        errorDetails: error.message,
      });
  }
};

module.exports = {
  submitAnswer,
  // İleride başka soruyla ilgili controller fonksiyonları buraya eklenebilir
};
