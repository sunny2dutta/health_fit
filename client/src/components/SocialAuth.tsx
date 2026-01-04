import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

export const SocialAuth: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const handleSocialLogin = async (provider: 'google' | 'apple') => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) throw error;
        } catch (error) {
            console.error('Error logging in:', error);
            // Optionally handle error state here
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', margin: '16px 0' }}>
            {/* Google Button */}
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 24px',
                    background: '#ffffff',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: '9999px',
                    fontSize: '1rem',
                    fontWeight: 500,
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer',
                    textTransform: 'none', // Override global button uppercase
                    letterSpacing: 'normal' // Override global letter spacing
                }}
            >
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    style={{ width: '20px', height: '20px', display: 'block' }}
                />
                <span>Continue with Google</span>
            </motion.button>

            {/* Apple Button */}
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => handleSocialLogin('apple')}
                disabled={loading}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 24px',
                    background: '#000000',
                    color: '#ffffff',
                    border: '1px solid #000000',
                    borderRadius: '9999px',
                    fontSize: '1rem',
                    fontWeight: 500,
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer',
                    textTransform: 'none',
                    letterSpacing: 'normal'
                }}
            >
                <img
                    src="https://www.svgrepo.com/show/511330/apple-173.svg"
                    alt="Apple"
                    style={{ width: '20px', height: '20px', display: 'block', filter: 'invert(1)' }}
                />
                <span>Continue with Apple</span>
            </motion.button>
        </div>
    );
};
