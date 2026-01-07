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
            <div className="menvy-brand" style={{ marginBottom: '80px' }}> {/* Increase spacing below logo */}
                <div className="menvy-logo" style={{
                    fontSize: '3.2rem', // Reduced by ~30% from 4.5rem
                    background: 'linear-gradient(to bottom right, #507fb3, #2a56ad, #1e3a8a)', // Slightly less saturated/intense blue
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 15px rgba(37, 99, 235, 0.15))' // Slightly softer glow
                }}>THE MENVY PROTOCOL</div>
                <div className="menvy-tagline" style={{
                    fontSize: '0.85rem', // Reduced ~15%
                    marginTop: '12px',
                    letterSpacing: '0.15em', // Increased spacing
                    color: '#94a3b8', // Lighter Grey (Slate-400)
                    fontWeight: '500',
                    textTransform: 'uppercase'
                }}>
                    Men’s Reproductive & Fertility Health — by Ananta Systems
                </div>
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
                A private, physician-informed fertility program for men.
            </h1>

            <p className="instruction-text" style={{ maxWidth: '700px' }}>
                Menvy delivers a personalized, end-to-end plan to improve sperm health, hormones, and reproductive outcomes—built around your data and goals.
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
                    placeholder="Email (for confidential correspondence)"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        background: '#1e293b', // Deep Charcoal/Navy
                        padding: '14px 24px', // Reduced height
                        borderRadius: '6px', // Reduced radius (not pill)
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '1rem',
                        fontWeight: '500',
                        marginTop: '8px'
                    }}
                >
                    {isLoading ? 'Processing...' : 'Request a Private Assessment'}
                </button>
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </form>
        </motion.div>
    );
};
