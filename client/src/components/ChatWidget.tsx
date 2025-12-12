import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
// import { ActionPopup } from './ActionPopup';
import type { Message, Action } from '../types/chat';

export const ChatWidget: React.FC = () => {
    const { totalScore, userId, userEmail } = useAssessment();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackGiven, setFeedbackGiven] = useState(false);
    const [pendingAction, setPendingAction] = useState<Action | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, pendingAction]);

    // Initial greeting
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: "Hi! I'm Menvy, your AI wellness companion. Based on your assessment results, I'm here to help you understand your health better and provide personalized guidance. What would you like to know?"
            }]);
        }
    }, []);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMessage }].map(m => ({
                        role: m.role,
                        content: m.content
                    })),
                    assessmentContext: `User completed health assessment with score: ${totalScore}/100`
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
                if (data.action) {
                    setPendingAction(data.action);
                }
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!feedbackGiven && messages.length > 1) {
            setShowFeedback(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleFeedbackSubmit = async (feedback: string) => {
        try {
            await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    feedback,
                    userId: userId,
                    email: userEmail
                })
            });
        } catch (error) {
            console.error('Feedback error:', error);
        } finally {
            setFeedbackGiven(true);
            setShowFeedback(false);
            setIsOpen(false);
        }
    };

    const handleActionResponse = async (accepted: boolean) => {
        if (!pendingAction) return;

        if (accepted) {
            window.open(pendingAction.url, '_blank');
        }

        const userResponse = accepted ? "Yes" : "No";
        setMessages(prev => [...prev, { role: 'user', content: userResponse }]);
        setPendingAction(null);
        setIsLoading(true);

        try {
            const updatedMessages = [
                ...messages,
                { role: 'user', content: userResponse }
            ].map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages,
                    assessmentContext: `User completed health assessment with score: ${totalScore}/100`
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
                if (data.action) {
                    setPendingAction(data.action);
                }
            }
        } catch (error) {
            console.error('Action response error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="menvy-chat-section">
            <h3>💬 Chat with Menvy</h3>
            <p className="trusted-text">Trusted by <strong>1,249</strong> men</p>

            {!isOpen && (
                <div className="chat-form">
                    <button onClick={() => setIsOpen(true)} className="chat-btn">
                        Chat with Menvy
                    </button>
                </div>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <span className="chat-avatar">💬</span>
                            <span className="chat-title">Menvy AI</span>
                        </div>
                        <button onClick={handleClose} className="chat-close-btn">
                            <X size={20} />
                        </button>
                    </div>

                    {showFeedback ? (
                        <FeedbackView onSubmit={handleFeedbackSubmit} onSkip={() => {
                            setFeedbackGiven(true);
                            setShowFeedback(false);
                            setIsOpen(false);
                        }} />
                    ) : (
                        <>
                            <div className="chat-messages">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`chat-message ${msg.role}`}>
                                        <div className="message-content">{msg.content}</div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="chat-message assistant">
                                        <div className="typing-indicator">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* {pendingAction && (
                                <ActionPopup action={pendingAction} onResponse={handleActionResponse} />
                            )} */}

                            <div className="chat-input-container">
                                <input
                                    type="text"
                                    className="chat-input"
                                    placeholder="Type your message..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    disabled={isLoading || !!pendingAction}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="chat-send-btn"
                                    disabled={isLoading || !inputValue.trim() || !!pendingAction}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const FeedbackView: React.FC<{ onSubmit: (text: string) => void; onSkip: () => void }> = ({ onSubmit, onSkip }) => {
    const [step, setStep] = useState<'prompt' | 'form'>('prompt');
    const [feedback, setFeedback] = useState('');

    if (step === 'prompt') {
        return (
            <div className="feedback-container">
                <div className="feedback-title">Would you be open to sharing feedback?</div>
                <div className="feedback-buttons">
                    <button className="feedback-btn yes" onClick={() => setStep('form')}>Yes</button>
                    <button className="feedback-btn no" onClick={onSkip}>No</button>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-container">
            <div className="feedback-title">We value your input!</div>
            <textarea
                className="feedback-textarea"
                placeholder="Tell us what you think..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
            />
            <button
                className="feedback-btn yes"
                style={{ width: '100%', maxWidth: 'none' }}
                onClick={() => onSubmit(feedback)}
            >
                Submit Feedback
            </button>
            <button
                className="feedback-btn no"
                style={{ width: '100%', maxWidth: 'none', marginTop: '10px' }}
                onClick={onSkip}
            >
                Cancel
            </button>
        </div>
    );
};
