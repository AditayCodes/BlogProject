import React, { useState } from 'react';
import Toast from '../components/Toast';
import { ToastContext } from './toastContext';

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        const newToast = { id, message, type, duration };
        
        setToasts(prev => [...prev, newToast]);
        
        // Auto remove toast after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration + 300); // Add 300ms for fade out animation
        }
        
        return id;
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const showSuccess = (message, duration) => showToast(message, 'success', duration);
    const showError = (message, duration) => showToast(message, 'error', duration);
    const showWarning = (message, duration) => showToast(message, 'warning', duration);
    const showInfo = (message, duration) => showToast(message, 'info', duration);

    return (
        <ToastContext.Provider value={{
            showToast,
            showSuccess,
            showError,
            showWarning,
            showInfo,
            removeToast
        }}>
            {children}
            
            {/* Render toasts */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast, index) => (
                    <div 
                        key={toast.id}
                        style={{ 
                            transform: `translateY(${index * 10}px)`,
                            zIndex: 50 - index 
                        }}
                    >
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            duration={0} // Managed by context
                            isVisible={true}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
