import React from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '../context/AssessmentContext';


const getHealthProfile = (score: number) => {
    if (score >= 85) {
        return {
            category: "Excellent Health Profile",
            description: "Outstanding! You're demonstrating excellent health habits.",
            recommendations: [
                "Maintain your current healthy lifestyle",
                "Share your wellness strategies with others",
                "Stay up to date with annual checkups"
            ]
        };
    } else if (score >= 70) {
        return {
            category: "Good Health Profile",
            description: "Great work! Your health foundation is strong.",
            recommendations: [
                "Improve stress management techniques",
                "Increase physical activity slightly",
                "Focus on your lowest scoring areas"
            ]
        };
    } else if (score >= 55) {
        return {
            category: "Moderate Health Profile",
            description: "You're doing well but can improve in key areas.",
            recommendations: [
                "Start one new healthy habit this week",
                "Improve sleep and stress balance",
                "Consider a health professional consult"
            ]
        };
    } else if (score >= 40) {
        return {
            category: "Developing Health Profile",
            description: "You have many opportunities for meaningful improvements.",
            recommendations: [
                "Begin with simple lifestyle changes",
                "Schedule a health checkup",
                "Try a health coach or nutritionist"
            ]
        };
    } else {
        return {
            category: "Foundation Building Profile",
            description: "This is your starting point toward better health.",
            recommendations: [
                "Start with small achievable goals",
                "Consult a healthcare professional",
                "Focus on one improvement at a time"
            ]
        };
    }
};

export const ResultsStep: React.FC = () => {
    const { totalScore, restartAssessment } = useAssessment();
    const profile = getHealthProfile(totalScore);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="section active"
        >
            <div className="details-message">
                <h2 id="results-heading" style={{ textAlign: 'center' }}>Now a bit more details</h2>
            </div>

            {/* ChatWidget is now global */}

            <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Your Health Assessment Results</h2>
            <div id="score-display">
                <div className="score-circle">
                    <span id="score-number">{totalScore}</span>
                    <span>/100</span>
                </div>
            </div>

            <div id="results-content" style={{ textAlign: 'center' }}>
                <h3 id="score-category">{profile.category}</h3>
                <p id="score-description">{profile.description}</p>

                <div id="recommendations" style={{ textAlign: 'left', marginTop: '2rem' }}>
                    <h4>Personalized Recommendations</h4>
                    <ul id="recommendation-list">
                        {profile.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                        ))}
                    </ul>
                </div>

                <div className="confidence-message" style={{ marginTop: '2rem', maxWidth: '600px', margin: '2rem auto' }}>
                    <h4>Building Your Confidence</h4>
                    <p>Knowledge is power. By taking this assessment, you've already taken the first step toward better health. Remember, small consistent changes lead to significant improvements over time.</p>
                </div>

                <button onClick={restartAssessment} style={{ maxWidth: '300px' }}>Take Assessment Again</button>
            </div>
        </motion.div>
    );
};
