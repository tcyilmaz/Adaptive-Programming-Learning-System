import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuestionsByCourse, getCourseById, submitAnswer } from '../services/api';
import './QuestionPage.css';

function QuestionPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [courseTitle, setCourseTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [fillBlankAnswer, setFillBlankAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Veri çek
    const fetchCourseAndQuestions = useCallback(async () => {
        setLoading(true);
        setError('');
        setQuestions([]);
        setCourseTitle('');
        setCurrentQuestionIndex(0);
        setFeedback(null);

        try {
            const courseRes = await getCourseById(courseId);
            if (courseRes.data && courseRes.data.success) {
                setCourseTitle(courseRes.data.data.name);
            } else {
                console.warn(courseRes.data.message || 'Course information could not be fetched.');
            }

            // Sonra soruları çek
            const questionsRes = await getQuestionsByCourse(courseId);
            if (questionsRes.data && questionsRes.data.success) {
                if (questionsRes.data.data && questionsRes.data.data.length > 0) {
                    setQuestions(questionsRes.data.data);
                } else {
                    setError('No questions found for this course.');
                    setQuestions([]);
                }
            } else {
                throw new Error(questionsRes.data.message || 'Error loading the questions.');
            }
        } catch (err) {
            console.error("Failed to fetch course/questions:", err);
            setError(err.message || 'Server Error.');
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [courseId, navigate]);

    useEffect(() => {
        if (courseId) {
            fetchCourseAndQuestions();
        }
    }, [fetchCourseAndQuestions, courseId]); 

    // soruyu çek
    const currentQuestion = questions.length > 0 && currentQuestionIndex < questions.length
        ? questions[currentQuestionIndex]
        : null;

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!currentQuestion || isSubmitting) return;

        setIsSubmitting(true);
        setFeedback(null);
        setError('');//errorları sıfırla

        const answerToSubmit = currentQuestion.question_type === 'MCQ' ? selectedAnswer : fillBlankAnswer;

        try {
            const response = await submitAnswer(currentQuestion.question_id, answerToSubmit);
            if (response.data && response.data.success) {
                setFeedback({
                    message: response.data.isCorrect
                        ? 'True!'
                        : `Wrong! Right answer is: ${response.data.correctAnswer}`,
                    isCorrect: response.data.isCorrect,
                });
            } else {
                setFeedback({
                    message: response.data.message || 'Error sending answer.',
                    isCorrect: false
                });
            }
        } catch (err) {
            console.error("Failed to submit answer:", err);
            setFeedback({
                message: 'Failed to submit feedback. Please try again.',
                isCorrect: false
            });
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                navigate('/login');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextQuestion = () => {
        setFeedback(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer('');
            setFillBlankAnswer('');
        } else {
            alert("Congrats! You finished this course.");
            navigate(`/courses/${courseId}`);
        }
    };

    if (loading) {
        return <div className="question-page-container"><p>Loading...</p></div>;
    }

    // soru yok veya genel hata
    if (error && questions.length === 0) { 
        return (
            <div className="question-page-container">
                <p className="error-message">{error}</p>
                <Link to="/courses">Course Details</Link>
            </div>
        );
    }


    if (!currentQuestion) {
        return (
            <div className="question-page-container">
                <p>Please refresh the page.</p>
                <Link to="/courses">Course Page</Link>
            </div>
        );
    }

    return (
        <div className="question-page-container">
                        <Link to={`/courses/${courseId}`} className="back-to-course-detail">
                {'<'} {courseTitle || 'Course Details'}
            </Link>
            <h1>Question {currentQuestionIndex + 1} / {questions.length}</h1>
            {error && feedback === null && <p className="error-message">{error}</p>}

            <div className="question-content">
                <p className="question-text">{currentQuestion.question_text?.replace('___', ' _____ ')}</p>

                {!feedback && (
                    <form onSubmit={handleAnswerSubmit}>
                        {currentQuestion.question_type === 'MCQ' && currentQuestion.options && (
                            <div className="mcq-options">
                                {currentQuestion.options.map((option, index) => (
                                    <label key={index} className="mcq-option">
                                        <input
                                            type="radio"
                                            name="mcqAnswer"
                                            value={option}
                                            checked={selectedAnswer === option}
                                            onChange={(e) => setSelectedAnswer(e.target.value)}
                                            required
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        )}

                        {currentQuestion.question_type === 'FillBlank' && (
                            <div className="fill-blank-input">
                                <input
                                    type="text"
                                    value={fillBlankAnswer}
                                    onChange={(e) => setFillBlankAnswer(e.target.value)}
                                    placeholder="Write your answer here"
                                    required
                                    autoFocus
                                />
                            </div>
                        )}
                        <button type="submit" className="submit-answer-button" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Answer'}
                        </button>
                    </form>
                )}

                {feedback && (
                    <div className={`feedback-message ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
                        <p>{feedback.message}</p>
                        <button onClick={handleNextQuestion} className="next-question-button">
                            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Course'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuestionPage;