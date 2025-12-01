import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '../context/AssessmentContext';

const PREFERENCES = [
    { value: "privacy-discretion", label: "Privacy/discretion" },
    { value: "convenience", label: "Convenience" },
    { value: "cost", label: "Cost" },
    { value: "expert-doctors", label: "Expert doctors" },
    { value: "quick-appointments", label: "Quick appointments" },
    { value: "home-delivery", label: "Home delivery of medications" }
];

export const ServicePreferencesStep: React.FC = () => {
    const { submitServicePreferences, isLoading, error } = useAssessment();
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

    const togglePreference = (value: string) => {
        setSelectedPreferences(prev =>
            prev.includes(value)
                ? prev.filter(p => p !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPreferences.length > 0) {
            await submitServicePreferences(selectedPreferences);
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

            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Service Preferences</h2>
            <p className="instruction-text">What would make you choose an online men's health service? (Select all that apply)</p>

            <form onSubmit={handleSubmit}>
                <div className="checkbox-group">
                    {PREFERENCES.map(pref => (
                        <label key={pref.value} className="checkbox-item">
                            <input
                                type="checkbox"
                                checked={selectedPreferences.includes(pref.value)}
                                onChange={() => togglePreference(pref.value)}
                            />
                            <span className="checkmark"></span>
                            {pref.label}
                        </label>
                    ))}
                </div>
                <button type="submit" disabled={isLoading || selectedPreferences.length === 0}>
                    {isLoading ? 'Finalizing...' : 'Start Assessment'}
                </button>
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </form>
        </motion.div>
    );
};
