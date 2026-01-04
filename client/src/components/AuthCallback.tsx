import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAssessment } from '../context/AssessmentContext';

export const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const { setSessionData } = useAssessment();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const { data } = await supabase.auth.getSession();

            if (data.session?.user?.email) {
                try {
                    // Check user status via our backend
                    const response = await fetch('/api/save-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: data.session.user.email })
                    });

                    if (response.ok) {
                        const result = await response.json();

                        // Sync context with backend data
                        setSessionData(result.user_id, data.session.user.email);

                        // Small delay to ensure Context propagates before unmounting
                        setTimeout(() => {
                            if (result.has_completed_assessment) {
                                navigate('/dashboard');
                            } else {
                                navigate('/');
                            }
                        }, 100);
                    } else {
                        // Fallback on error
                        navigate('/');
                    }
                } catch (e) {
                    console.error("Error checking user status:", e);
                    navigate('/');
                }
            } else {
                // Failed login or no session
                navigate('/');
            }
        };

        handleAuthCallback();
    }, [navigate]);

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
