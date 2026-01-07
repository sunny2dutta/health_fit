import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAssessment } from '../context/AssessmentContext';

export const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const { setSessionData } = useAssessment();

    useEffect(() => {
        let mounted = true;

        const handleAuth = async () => {
            // Check current session
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Auth Error:", error);
                if (mounted) navigate('/');
                return;
            }

            if (session?.user?.email) {
                processUser(session.user.email);
            } else {
                // If no session yet, listen for the event (handles the hash processing)
                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                    if (event === 'SIGNED_IN' && session?.user?.email) {
                        processUser(session.user.email);
                    } else if (event === 'SIGNED_OUT') {
                        if (mounted) navigate('/');
                    }
                });

                return () => {
                    subscription.unsubscribe();
                };
            }
        };

        const processUser = async (email: string) => {
            if (!mounted) return;
            try {
                // Sync with backend
                const response = await fetch('/api/save-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                if (response.ok) {
                    const result = await response.json();
                    if (!mounted) return;

                    // Use backend ID (number) not Supabase UUID (string)
                    setSessionData(result.user_id, email);

                    // Navigate based on assessment status
                    if (result.has_completed_assessment) {
                        navigate('/dashboard');
                    } else {
                        navigate('/');
                    }
                } else {
                    console.error("Backend sync failed");
                    if (mounted) navigate('/');
                }
            } catch (e) {
                console.error("Error processing user:", e);
                if (mounted) navigate('/');
            }
        };

        handleAuth();

        return () => {
            mounted = false;
        };
    }, [navigate, setSessionData]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '1.2rem',
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-body)',
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div className="loading-spinner" style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid var(--border-color)',
                    borderTop: '3px solid var(--primary-color)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <p>Signing you in...</p>
                <style>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        </div>
    );
};
