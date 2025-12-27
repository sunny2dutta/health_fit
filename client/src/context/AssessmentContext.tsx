import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { type AssessmentState, type Answer, type UserData, QUESTIONS } from '../types';

interface AssessmentContextType extends AssessmentState {
    submitEmail: (email: string) => Promise<void>;
    submitAnswer: (answer: Answer) => void;
    submitPersonalInfo: (data: Partial<UserData>) => Promise<void>;
    submitHealthConcerns: (concerns: string[]) => Promise<void>;
    submitServicePreferences: (prefs: string[]) => Promise<void>;
    submitGoogleAuth: (credential: string) => Promise<void>;
    restartAssessment: () => void;
    currentQuestionIndex: number;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessment = () => {
    const context = useContext(AssessmentContext);
    if (!context) {
        throw new Error('useAssessment must be used within an AssessmentProvider');
    }
    return context;
};

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AssessmentState>({
        currentStep: 0, // 0: Email, 1: Questions, 2: Personal Info, 3: Concerns, 4: Services, 5: Results
        totalScore: 0,
        userEmail: "",
        userId: null,
        userData: {},
        answers: [],
        isLoading: false,
        error: null
    });

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const postData = async (url: string, data: any) => {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server Error ${response.status}: ${errorText}`);
            }

            return await response.json();
        } catch (error: any) {
            console.error(`Error posting to ${url}:`, error);
            throw error;
        }
    };

    const submitEmail = async (email: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            // Optimistic update
            setState(prev => ({ ...prev, userEmail: email, currentStep: 1 }));

            const result = await postData("/api/save-email", { email });
            if (result && result.user_id) {
                setState(prev => ({ ...prev, userId: result.user_id, isLoading: false }));
            } else {
                throw new Error("No user ID returned");
            }
        } catch (error: any) {
            setState(prev => ({ ...prev, isLoading: false, error: error.message }));
            // Revert step if critical? For now, we let them continue but show error.
        }
    };

    const submitGoogleAuth = async (credential: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const result = await postData("/api/auth/google", { credential });

            if (result && result.success && result.user) {
                // Store token if needed, for now just proceeding
                if (result.token) {
                    localStorage.setItem('auth_token', result.token);
                }

                setState(prev => ({
                    ...prev,
                    userId: result.user.id,
                    userEmail: result.user.email,
                    currentStep: 1,
                    isLoading: false
                }));
            } else {
                throw new Error("Google Auth failed: Invalid response");
            }
        } catch (error: any) {
            console.error("Google Auth Error:", error);
            setState(prev => ({ ...prev, isLoading: false, error: error.message }));
        }
    };

    const submitAnswer = (answer: Answer) => {
        setState(prev => ({
            ...prev,
            answers: [...prev.answers, answer],
            totalScore: prev.totalScore + answer.score
        }));

        if (currentQuestionIndex < QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setState(prev => ({ ...prev, currentStep: 2 }));
        }
    };

    const submitPersonalInfo = async (data: Partial<UserData>) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            setState(prev => ({ ...prev, userData: { ...prev.userData, ...data } }));

            await postData("/api/save-personal-info", {
                user_id: state.userId, // Note: might be null if email failed, handle gracefully?
                full_name: data.name,
                date_of_birth: data.dateOfBirth,
                phone: data.phone
            });

            setState(prev => ({ ...prev, currentStep: 3, isLoading: false }));
        } catch (error: any) {
            setState(prev => ({ ...prev, isLoading: false, error: error.message }));
        }
    };

    const submitHealthConcerns = async (concerns: string[]) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            setState(prev => ({ ...prev, userData: { ...prev.userData, healthConcerns: concerns } }));

            await postData("/api/save-health-concerns", {
                user_id: state.userId,
                concerns
            });

            setState(prev => ({ ...prev, currentStep: 4, isLoading: false }));
        } catch (error: any) {
            setState(prev => ({ ...prev, isLoading: false, error: error.message }));
        }
    };

    const submitServicePreferences = async (prefs: string[]) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            setState(prev => ({ ...prev, userData: { ...prev.userData, servicePreferences: prefs } }));

            await postData("/api/save-service-preferences", {
                user_id: state.userId,
                preferences: prefs
            });

            // Save final assessment
            await postData("/api/save-assessment", {
                user_id: state.userId,
                email: state.userEmail,
                score: state.totalScore, // Note: totalScore needs to be current
                answers: state.answers // Note: answers needs to be current
            });

            setState(prev => ({ ...prev, currentStep: 5, isLoading: false }));
        } catch (error: any) {
            setState(prev => ({ ...prev, isLoading: false, error: error.message }));
        }
    };

    const restartAssessment = () => {
        setState({
            currentStep: 0,
            totalScore: 0,
            userEmail: "",
            userId: null,
            userData: {},
            answers: [],
            isLoading: false,
            error: null
        });
        setCurrentQuestionIndex(0);
    };

    return (
        <AssessmentContext.Provider value={{
            ...state,
            submitEmail,
            submitAnswer,
            submitPersonalInfo,
            submitHealthConcerns,
            submitServicePreferences,
            submitGoogleAuth,
            restartAssessment,
            currentQuestionIndex
        }}>
            {children}
        </AssessmentContext.Provider>
    );
};
