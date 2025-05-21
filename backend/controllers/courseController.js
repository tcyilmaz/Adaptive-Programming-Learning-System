const db = require("../config/db");


const getAllCourses = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT course_id, name, description, language FROM courses ORDER BY name ASC"
    );
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching courses" });
  }
};
const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params; // URL'den courseId'yi al

    // Veritabanından ilgili kursu çek
    const result = await db.query(
      "SELECT course_id, name, description, language FROM courses WHERE course_id = $1",
      [courseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Course not found with ID: ${courseId}`,
      });
    }

    // Başarılı yanıt
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      `Error getting course by ID (${req.params.courseId}):`,
      error
    );
    if (error.message.includes("invalid input syntax for type uuid")) {
      return res.status(400).json({
        success: false,
        message: "Invalid Course ID format provided.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while fetching course details",
    });
  }
};

const getNextQuestion = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;
  const now = new Date();

  // pick next question
  try {
    let nextQuestionQuery;
    let queryParams;

    nextQuestionQuery = `
            SELECT q.question_id, q.course_id, q.question_type, q.question_text, q.options, q.difficulty
            FROM questions q
            JOIN user_progress up ON q.question_id = up.question_id
            WHERE up.user_id = $1 AND q.course_id = $2 AND up.next_review_date <= $3
            ORDER BY up.consecutive_correct_answers ASC, up.next_review_date ASC
            LIMIT 1;
        `;
    queryParams = [userId, courseId, now];
    let result = await db.query(nextQuestionQuery, queryParams);

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows[0]);
    }

    nextQuestionQuery = `
            SELECT q.question_id, q.course_id, q.question_type, q.question_text, q.options, q.difficulty
            FROM questions q
            LEFT JOIN user_progress up ON q.question_id = up.question_id AND up.user_id = $1
            WHERE q.course_id = $2 AND up.user_progress_id IS NULL
            ORDER BY q.created_at ASC -- Or q.difficulty ASC, q.question_id ASC for stable order
            LIMIT 1;
        `;
    queryParams = [userId, courseId];
    result = await db.query(nextQuestionQuery, queryParams);

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows[0]);
    }

    const anyFutureReviews = await db.query(
      `SELECT 1 FROM user_progress up
             JOIN questions q ON q.question_id = up.question_id
             WHERE up.user_id = $1 AND q.course_id = $2 AND up.next_review_date > $3
             LIMIT 1;`,
      [userId, courseId, now]
    );

    if (anyFutureReviews.rows.length > 0) {
      return res.status(200).json({
        message:
          "You're all caught up for now! Come back later for more reviews.",
        courseComplete: false,
        nextQuestion: null,
      });
    } else {
      const courseHasQuestions = await db.query(
        "SELECT 1 FROM questions WHERE course_id = $1 LIMIT 1",
        [courseId]
      );
      if (courseHasQuestions.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "This course has no questions." });
      }

      return res.status(200).json({
        message:
          "You have completed this course.",
        courseComplete: true,
        nextQuestion: null,
      });
    }
  } catch (error) {
    console.error("Error fetching next question:", error);
    res.status(500).json({ message: "Server error fetching question" });
  }
};
const getQuestionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const courseExists = await db.query(
      "SELECT 1 FROM courses WHERE course_id = $1",
      [courseId]
    );
    if (courseExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Course not found with ID: ${courseId}`,
      });
    }

        const result = await db.query(
      `SELECT question_id, course_id, question_type, question_text, options, difficulty
             FROM questions
             WHERE course_id = $1
             ORDER BY created_at ASC`,
      [courseId]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "This course has no questions.",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      `Error getting questions for course (${req.params.courseId}):`,
      error
    );
    if (error.message.includes("invalid input syntax for type uuid")) {
      return res.status(400).json({
        success: false,
        message: "Invalid Course ID format provided.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while fetching questions",
    });
  }
};


module.exports = {
  getAllCourses,
  getCourseById,
  getQuestionsByCourse,
};
