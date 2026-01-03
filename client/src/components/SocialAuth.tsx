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
                    redirectTo: `${window.location.origin}/`
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
        <div className="flex flex-col gap-3 w-full my-4">
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium shadow-sm hover:bg-gray-50 transition-colors"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                <span>Continue with Google</span>
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => handleSocialLogin('apple')}
                disabled={loading}
                className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-black text-white rounded-xl font-medium shadow-sm hover:bg-gray-900 transition-colors"
            >
                <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5 invert" />
                <span>Continue with Apple</span>
            </motion.button>
        </div>
    );
};
