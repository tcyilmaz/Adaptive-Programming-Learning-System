import React from 'react';
import './MCQQuestion.css'; // We'll create this CSS file

function MCQQuestion({ question, userAnswer, onAnswerChange, isSubmitted }) {
    // question object is expected to have:
    // question.question_text (string)
    // question.options (array of strings)

    if (!question || !question.options) {
        return <p>Error: Question data is missing or incomplete for MCQ.</p>;
    }

    return (
        <div className="mcq-question-container">
            <p className="question-text">{question.question_text}</p>
            <div className="options-container">
                {question.options.map((option, index) => (
                    <div key={index} className={`option-item ${userAnswer === option ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            id={`mcq-option-${question.question_id}-${index}`} // Ensure unique ID
                            name={`mcqAnswer-${question.question_id}`} // Ensure unique name per question
                            value={option}
                            checked={userAnswer === option}
                            onChange={() => onAnswerChange(option)} // Pass the selected option string
                            disabled={isSubmitted} // Disable after feedback/submission
                        />
                        <label htmlFor={`mcq-option-${question.question_id}-${index}`}>{option}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MCQQuestion;