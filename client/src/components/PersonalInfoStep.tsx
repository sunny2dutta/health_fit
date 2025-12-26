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
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <label htmlFor="bday" className="sr-only">Date of Birth</label>
                <input
                    type="date"
                    name="bday"
                    id="bday"
                    autoComplete="bday"
                    placeholder="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                />
                <label htmlFor="tel" className="sr-only">Phone Number</label>
                <input
                    type="tel"
                    name="tel"
                    id="tel"
                    autoComplete="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    minLength={10}
                    pattern="[0-9]{10,}"
                    title="Phone number must be at least 10 digits"
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Continue'}
                </button>
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </form>
        </motion.div>
    );
};
