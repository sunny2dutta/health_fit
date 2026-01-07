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
            {/* Restrained Header */}
            <div style={{ textAlign: 'center', marginBottom: '48px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '0.1em', color: 'var(--text-main)', marginBottom: '8px' }}>THE MENVY PROTOCOL</div>
                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Men’s Reproductive & Fertility Health</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Developed and operated by Ananta Systems</div>
            </div>

            <h1 style={{
                textAlign: 'center',
                fontSize: '2.5rem',
                fontWeight: '600',
                marginBottom: '24px',
                lineHeight: '1.3',
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-heading)'
            }}>
                A private, physician-informed fertility optimization program for men.
            </h1>

            <p className="instruction-text" style={{ maxWidth: '700px' }}>
                Menvy delivers a personalized, end-to-end plan to improve sperm health, hormones, and reproductive outcomes—built from your data, lifestyle, and goals.
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
