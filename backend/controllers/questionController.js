const db = require('../config/db');

function calculateNextReview(currentDate, intervalDays) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + intervalDays);
    return nextDate;
}

const submitAnswer = async (req, res) => {
    const { questionId } = req.params;
    const { answer } = req.body;
    const userId = req.user.id;

    if (answer === undefined || answer === null || String(answer).trim() === '') {
        return res.status(400).json({ message: 'Answer submission is required and cannot be empty.' });
    }

    try {
        // Fetch question details
        const questionResult = await db.query(
            'SELECT question_id, correct_answer, difficulty FROM questions WHERE question_id = $1',
            [questionId]
        );

        if (questionResult.rows.length === 0) {
            return res.status(404).json({ message: 'Question not found.' });
        }
        const question = questionResult.rows[0];

        // Check answer
        const isCorrect = String(answer).trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase();

        // Update user progress
        let progressResult = await db.query(
            'SELECT * FROM user_progress WHERE user_id = $1 AND question_id = $2',
            [userId, questionId]
        );

        let userProgress;
        const now = new Date();

        let newConsecutiveCorrect = 0;
        let newInterval = 0;
        let nextReviewDate;

        if (progressResult.rows.length > 0) {
            userProgress = progressResult.rows[0];
        } else {
            userProgress = {
                consecutive_correct_answers: 0,
                current_interval: 0,
                times_attempted: 0,
            };
        }

        if (isCorrect) {
            newConsecutiveCorrect = userProgress.consecutive_correct_answers + 1;

            switch (newConsecutiveCorrect) {
                case 1:
                    newInterval = 1;
                    break;
                case 2:
                    newInterval = 3;
                    break;
                case 3:
                    newInterval = 7;
                    break;
                default: // if correct answer streak is bigger than 3
                    const prevInterval = userProgress.current_interval > 0 ? userProgress.current_interval : 7;
                    // increase interval by multiplying 1.85, max 120 days
                    newInterval = Math.min(Math.round(prevInterval * 1.85), 120);
                    break;
            }
        } else { // if answer is incorrect 
            newConsecutiveCorrect = 0;
            newInterval = 1; // Ask again tomorrow
        }

        nextReviewDate = calculateNextReview(now, newInterval);
        const newTimesAttempted = userProgress.times_attempted + 1;

        // Update User Progress
        if (progressResult.rows.length > 0) {
            await db.query(
                `UPDATE user_progress
                 SET consecutive_correct_answers = $1, current_interval = $2,
                     next_review_date = $3, last_answered_correctly = $4, last_attempted_at = $5,
                     times_attempted = $6
                 WHERE user_progress_id = $7`, 
                [
                    newConsecutiveCorrect, newInterval, nextReviewDate,
                    isCorrect, now, newTimesAttempted, userProgress.user_progress_id
                ]
            );
        } else {
            await db.query(
                `INSERT INTO user_progress (user_id, question_id, consecutive_correct_answers,
                                        current_interval, next_review_date, last_answered_correctly,
                                        last_attempted_at, times_attempted) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    userId, questionId, newConsecutiveCorrect, newInterval,
                    nextReviewDate, isCorrect, now, newTimesAttempted
                ]
            );
        }

        // Point System
        let pointsEarned = 0;
        if (isCorrect) {
            pointsEarned = question.difficulty * 10;
            if (newConsecutiveCorrect > 1) pointsEarned += (newConsecutiveCorrect - 1) * 5;
        }
        if (pointsEarned > 0) {
            await db.query(
                'UPDATE users SET points = COALESCE(points, 0) + $1 WHERE user_id = $2',
                [pointsEarned, userId]
            );
        }

        // Feedback
        res.status(200).json({
            isCorrect: isCorrect,
            correctAnswer: question.correct_answer,
            pointsEarned: pointsEarned,
            message: isCorrect ? 'Correct!' : 'Incorrect.',
        });

    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ message: 'Server error submitting answer.' });
    }
};

module.exports = {
    submitAnswer,
};