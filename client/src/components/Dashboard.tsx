import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ChatWidget } from './ChatWidget';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email || 'User');
            } else {
                navigate('/');
            }
        };
        getUser();
    }, [navigate]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Waitlist Dashboard</h1>
            <p>Welcome, {userEmail}!</p>
            <p>You have successfully joined the waitlist.</p>

            <ChatWidget />

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                    onClick={async () => {
                        // Optional: Clear assessment state if needed, but context handles restart
                        navigate('/');
                    }}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    Retake Assessment
                </button>
            </div>

            <button
                onClick={handleSignOut}
                style={{
                    marginTop: '2rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--bg-card-hover)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    color: 'var(--text-main)'
                }}
            >
                Sign Out
            </button>
        </div>
    );
};
