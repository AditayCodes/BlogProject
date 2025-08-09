import React, { useEffect, useState } from 'react';

function Toast({ 
    message, 
    type = 'info', 
    duration = 3000, 
    onClose,
    isVisible = false 
}) {
    const [show, setShow] = useState(isVisible);

    useEffect(() => {
        setShow(isVisible);
        
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(() => {
                    if (onClose) onClose();
                }, 300); // Wait for fade out animation
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible && !show) return null;

    const getToastStyles = () => {
        const baseStyles = "fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 max-w-sm";
        
        switch (type) {
            case 'success':
                return `${baseStyles} bg-green-500 text-white`;
            case 'error':
                return `${baseStyles} bg-red-500 text-white`;
            case 'warning':
                return `${baseStyles} bg-yellow-500 text-white`;
            case 'info':
            default:
                return `${baseStyles} bg-blue-500 text-white`;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );
            case 'info':
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <div 
            className={`${getToastStyles()} ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
        >
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button
                    onClick={() => {
                        setShow(false);
                        setTimeout(() => {
                            if (onClose) onClose();
                        }, 300);
                    }}
                    className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Toast;
