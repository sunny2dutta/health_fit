import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '../context/AssessmentContext';

export const PersonalInfoStep: React.FC = () => {
    const { submitPersonalInfo, isLoading, error } = useAssessment();
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        phone: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.dateOfBirth && formData.phone) {
            await submitPersonalInfo(formData);
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

            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Tell us a bit about yourself</h2>
            <p className="instruction-text">This helps us personalize your health plan.</p>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <input
                    type="date"
                    placeholder="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                />
                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Continue'}
                </button>
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </form>
        </motion.div>
    );
};
