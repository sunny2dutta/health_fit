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

                        if (result.has_completed_assessment) {
                            navigate('/dashboard');
                        } else {
                            // New or incomplete user -> Go to questions
                            // We redirect to home but the Context there will pick it up
                            // To be safe, we can pass a state or query param if needed, 
                            // but our Context logic already checks the user on mount.
                            navigate('/');
                        }
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
            color: '#666'
        }}>
            Signing you in...
        </div>
    );
};
