import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '../context/AssessmentContext';
import { QUESTIONS, type Option } from '../types';

export const QuestionStep: React.FC = () => {
    const { currentQuestionIndex, submitAnswer } = useAssessment();
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);

    const question = QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

    const handleOptionSelect = (option: Option) => {
        setSelectedOption(option);
    };

    const handleNext = () => {
        if (selectedOption) {
            submitAnswer({
                question: question.question,
                selectedAnswer: selectedOption.text,
                score: selectedOption.score
            });
            setSelectedOption(null);
        }
    };

    return (
        <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="section active"
        >
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="menvy-brand">
                <div className="menvy-logo">Menvy</div>
            </div>

            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{question.question}</h2>

            <div className="options">
                {question.options.map((opt, idx) => (
                    <button
                        key={idx}
                        className={`option-btn ${selectedOption?.text === opt.text ? 'selected' : ''}`}
                        onClick={() => handleOptionSelect(opt)}
                    >
                        {opt.text}
                    </button>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                    onClick={handleNext}
                    disabled={!selectedOption}
                    style={{ maxWidth: '300px' }}
                >
                    Next Question
                </button>
            </div>
        </motion.div>
    );
};
