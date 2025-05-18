import React from 'react';
import './FillBlankQuestion.css'; // We'll create this

function FillBlankQuestion({ question, userAnswer, onAnswerChange, isSubmitted }) {
    // question object is expected to have:
    // question.question_text (string, with '____' as the blank placeholder)

    if (!question || typeof question.question_text !== 'string') {
        return <p>Error: Question data is missing or incomplete for Fill-in-the-Blank.</p>;
    }

    // Split the question text by the placeholder '____'
    // If no placeholder, assume the entire question is before the blank or handle as error
    const parts = question.question_text.split('____');
    const beforeText = parts[0];
    const afterText = parts.length > 1 ? parts.slice(1).join('____') : ''; // Join back if multiple '____' were intended for complex cases, though typically one.

    return (
        <div className="fill-blank-question-container">
            <p className="question-text-fill-blank">
                {beforeText}
                <input
                    type="text"
                    className="blank-input"
                    value={userAnswer}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    disabled={isSubmitted}
                    placeholder="Your answer"
                    aria-label="Fill in the blank"
                />
                {afterText}
            </p>
        </div>
    );
}

export default FillBlankQuestion;