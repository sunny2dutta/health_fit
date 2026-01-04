import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export const AuthCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const { data } = await supabase.auth.getSession();

            if (data.session) {
                // Successful login
                navigate('/dashboard');
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
