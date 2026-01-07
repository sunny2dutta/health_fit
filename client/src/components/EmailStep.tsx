import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '../context/AssessmentContext';
import { SocialAuth } from './SocialAuth';
export const EmailStep: React.FC = () => {
    const { submitEmail, isLoading, error } = useAssessment();
    const [email, setEmail] = useState('');
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
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
            initial={false}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="section active"
        >
            <div className="menvy-brand">
                <div className="menvy-logo">The Menvy Protocol</div>
                <div className="menvy-tagline">by Ananta Systems</div>
            </div>

            <h1 style={{
                textAlign: 'center',
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '16px',
                lineHeight: '1.2',
                maxWidth: '700px',
                marginLeft: 'auto',
                marginRight: 'auto',
                color: 'var(--text-main)'
            }}>
                Take control of your fertility with a plan built for your body.
            </h1>

            <p className="instruction-text">
                Answer a confidential assessment and get personalized guidance to improve sperm quality, hormones, and reproductive health.
            </p>

            <form onSubmit={handleSubmit} autoComplete="on">
                {/* Hidden input to boost autofill confidence (Identity Heuristic) */}
                <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                />

                <SocialAuth />

                <div style={{ height: '12px' }}></div>

                <label htmlFor="email" className="sr-only">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Start Confidential Assessment'}
                </button>
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </form>
        </motion.div>
    );
};
