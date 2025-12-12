import React from 'react';
import type { Action } from '../types/chat';

interface ActionPopupProps {
    action: Action;
    onResponse: (accepted: boolean) => void;
}

export const ActionPopup: React.FC<ActionPopupProps> = ({ action, onResponse }) => {
    return (
        <div className="action-popup">
            <div className="action-content">
                <p>Would you like to proceed with <strong>{action.value}</strong>?</p>
                <div className="action-buttons">
                    <button onClick={() => onResponse(true)} className="action-btn yes">Yes</button>
                    <button onClick={() => onResponse(false)} className="action-btn no">No</button>
                </div>
            </div>
        </div>
    );
};
