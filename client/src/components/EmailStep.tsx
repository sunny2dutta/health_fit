import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '../context/AssessmentContext';

export const EmailStep: React.FC = () => {
    const { submitEmail, isLoading, error } = useAssessment();
    const [email, setEmail] = useState('');

    React.useEffect(() => {
        console.log("EmailStep mounted");
        return () => console.log("EmailStep unmounted");
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            await submitEmail(email);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="section active"
        >
            <div className="menvy-brand">
                <div className="menvy-logo">The Menvy Protocol</div>
                <div className="menvy-tagline">by Ananta Systems</div>
            </div>

            <p className="instruction-text">
                Start your journey to better health. Enter your email to begin your personalized assessment.
            </p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="email" className="sr-only">Email Address</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Start Assessment'}
                </button>
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </form>
        </motion.div>
    );
};
