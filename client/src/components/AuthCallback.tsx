import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAssessment } from '../context/AssessmentContext';

export const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const { setSessionData } = useAssessment();

    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            if (mounted) {
                controller.abort();
                setError("Authentication timed out. This often happens if your System Clock is wrong. Please check your date & time settings.");
            }
        }, 10000); // 10s timeout to show error

        const handleAuth = async () => {
            try {
                // Check current session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (session?.user?.email) {
                    await processUser(session.user.email, controller.signal);
                } else {
                    // Fail fast if we have an access token in URL but no session (Expired/Invalid)
                    if (window.location.hash && window.location.hash.includes('access_token')) {
                        console.error("Token present but session null (likely expired)");
                        throw new Error("Login link expired. Please go back and try again.");
                    }

                    // Listen for auth event (Fallback)
                    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                        if (event === 'SIGNED_IN' && session?.user?.email) {
                            await processUser(session.user.email, controller.signal);
                        } else if (event === 'SIGNED_OUT') {
                            if (mounted) navigate('/');
                        }
                    });

                    return () => {
                        subscription.unsubscribe();
                    };
                }
            } catch (err: any) {
                console.error("Auth Init Error:", err);
                if (mounted) setError(err.message || 'Authentication failed');
            }
        };

        const processUser = async (email: string, signal: AbortSignal) => {
            if (!mounted) return;
            try {
                // Sync with backend
                console.log("Syncing user:", email);
                const response = await fetch('/api/save-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                    signal
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

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
            } catch (e: any) {
                console.error("Error processing user:", e);
                if (e.name === 'AbortError') {
                    if (mounted) setError("Connection timed out. Please check your internet or try again.");
                } else {
                    if (mounted) setError(e.message || "Failed to sync user data");
                }
            }
        };

        handleAuth();

        return () => {
            mounted = false;
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [navigate, setSessionData]);

    if (error) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-body)',
            }}>
                <div style={{ color: '#ef4444', marginBottom: '16px' }}>⚠️ {error}</div>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: 'var(--primary-color)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Return Home
                </button>
            </div>
        );
    }

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
