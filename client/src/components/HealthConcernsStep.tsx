import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '../context/AssessmentContext';

const CONCERNS = [
    { value: "sexual-health-ed", label: "Sexual health/ED" },
    { value: "fertility", label: "Fertility" },
    { value: "hair-loss", label: "Hair loss" },
    { value: "weight-fitness", label: "Weight/fitness" },
    { value: "hormone-issues", label: "Hormone issues" },
    { value: "mental-health", label: "Mental health" },
    { value: "heart-health", label: "Heart Health" },
    { value: "general-wellness", label: "General wellness" },
    { value: "prefer-not-say", label: "Prefer not to say" }
];

export const HealthConcernsStep: React.FC = () => {
    const { submitHealthConcerns, isLoading, error } = useAssessment();
    const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

    const toggleConcern = (value: string) => {
        setSelectedConcerns(prev =>
            prev.includes(value)
                ? prev.filter(c => c !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedConcerns.length > 0) {
            await submitHealthConcerns(selectedConcerns);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="section active"
        >
            <div className="menvy-brand">
                <div className="menvy-logo">Menvy</div>
            </div>

            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Health Concerns</h2>
            <p className="instruction-text">What brings you here? (Select all that apply)</p>

            <form onSubmit={handleSubmit}>
                <div className="checkbox-group">
                    {CONCERNS.map(concern => (
                        <label key={concern.value} className="checkbox-item">
                            <input
                                type="checkbox"
                                checked={selectedConcerns.includes(concern.value)}
                                onChange={() => toggleConcern(concern.value)}
                            />
                            <span className="checkmark"></span>
                            {concern.label}
                        </label>
                    ))}
                </div>
                <button type="submit" disabled={isLoading || selectedConcerns.length === 0}>
                    {isLoading ? 'Saving...' : 'Continue'}
                </button>
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </form>
        </motion.div>
    );
};
