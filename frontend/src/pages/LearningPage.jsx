// frontend/src/pages/LearningPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';
import MCQQuestion from '../components/questions/MCQQuestion.jsx'; // Ensure .jsx extension if needed by your setup
import FillBlankQuestion from '../components/questions/FillBlankQuestion.jsx'; // Ensure .jsx extension

// Optional: Create and import LearningPage.css if you have specific styles for the page layout itself
// import './LearningPage.css';

function LearningPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); // For general errors or messages like "all caught up"
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchNextQuestion = useCallback(async () => {
        setLoading(true);
        setError('');
        setFeedback(null);
        setUserAnswer('');
        setQuestion(null);

        try {
            const response = await apiClient.get(`/courses/${courseId}/next-question`);
            if (response.data.nextQuestion === null && response.data.message) {
                setError(response.data.message); // "all caught up" or "course complete"
            } else if (response.data && response.data.question_id) {
                setQuestion(response.data);
            } else if (response.data && !response.data.question_id && response.data.message) {
                // Handle cases where backend sends only a message without a question object
                setError(response.data.message);
            }
            else {
                setError("Could not load the next question or an unexpected response was received.");
            }
        } catch (err) {
            console.error("Failed to fetch question:", err.response?.data || err.message);
            if (err.response?.status === 404 && err.response?.data?.message) {
                 setError(err.response.data.message);
            } else if (err.response?.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                setError('Could not load the next question. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    }, [courseId, navigate]);

    useEffect(() => {
        fetchNextQuestion();
    }, [fetchNextQuestion]);

    const handleAnswerChange = (value) => {
        setUserAnswer(value);
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        if (!userAnswer && userAnswer !==0 || !question || isSubmitting) return; // Allow 0 as an answer for some question types
        setIsSubmitting(true);
        setError('');
        try {
            const response = await apiClient.post(`/questions/${question.question_id}/submit`, {
                answer: userAnswer,
            });
            setFeedback(response.data);
        } catch (err) {
            console.error("Failed to submit answer:", err.response?.data || err.message);
            setError('Could not submit your answer. Please try again.');
            if (err.response?.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderQuestionContent = () => {
        if (!question || !question.question_type) return null;

        switch (question.question_type) {
            case 'MCQ':
                return (
                    <MCQQuestion
                        question={question}
                        userAnswer={userAnswer}
                        onAnswerChange={handleAnswerChange}
                        isSubmitted={!!feedback}
                    />
                );
            case 'FillBlank':
                return (
                    <FillBlankQuestion
                        question={question}
                        userAnswer={userAnswer}
                        onAnswerChange={handleAnswerChange}
                        isSubmitted={!!feedback}
                    />
                );
            default:
                return <p>Unsupported question type: {question.question_type}</p>;
        }
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Question...</div>;

    // If there's an error message (could be "all caught up", "course complete", or an actual error)
    // and no question is loaded, display the message.
    if (error && !question) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ color: error.includes("Congratulations") || error.includes("caught up") ? 'inherit' : 'red', marginBottom: '20px' }}>
                    {error}
                </p>
                <Link to="/dashboard" className="cta-button login">Back to Dashboard</Link> {/* Reusing cta-button style */}
            </div>
        );
    }

    // If no question is available after loading and no specific message was set as error (should be caught by above)
    if (!question && !loading) {
         return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{marginBottom: '20px'}}>No question available at the moment.</p>
                <Link to="/dashboard" className="cta-button login">Back to Dashboard</Link>
            </div>
         );
    }

    // This should ideally not be reached if error handling above is complete for no-question scenarios
    if (!question) return null;


    return (
        <div className="learning-page-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ marginBottom: '20px' }}><Link to="/dashboard">← Back to Dashboard</Link></p>
            <h3>Learning: Question for Course</h3> {/* We might fetch course name later */}
            <hr style={{margin: '15px 0'}}/>

            {!feedback ? (
                <form onSubmit={handleSubmitAnswer}>
                    {renderQuestionContent()}
                    {question && question.question_id && /* Only show submit if there's a valid question */
                        <button type="submit" disabled={isSubmitting || (!userAnswer && userAnswer !==0) || !question.question_id} style={{marginTop: '20px', padding: '10px 15px'}}>
                            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                        </button>
                    }
                </form>
            ) : (
                <div>
                    {renderQuestionContent()} {/* Show the question again with inputs disabled */}
                    <div style={{ marginTop: '20px', padding: '15px', border: `2px solid ${feedback.isCorrect ? '#4CAF50' : '#ff4d4d'}`, borderRadius: '5px', backgroundColor: feedback.isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 77, 77, 0.1)' }}>
                        <h4>{feedback.message}</h4>
                        {!feedback.isCorrect && <p><strong>Correct Answer:</strong> {feedback.correctAnswer}</p>}
                        <p>Points Earned: {feedback.pointsEarned}</p>
                        <button onClick={fetchNextQuestion} style={{marginTop: '10px', padding: '10px 15px'}}>Next Question</button>
                    </div>
                </div>
            )}
            {/* Display general error messages that occur when a question IS loaded */}
            {error && question && <p style={{ color: 'red', marginTop: '15px' }}>Error: {error}</p>}
        </div>
    );
}

export default LearningPage;