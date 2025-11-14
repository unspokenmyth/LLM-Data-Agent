
import React, { useEffect, useState } from 'react';
import { ErrorIcon } from './icons/ErrorIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { InfoIcon } from './icons/InfoIcon';

interface ToastProps {
  message: string;
  type: 'error' | 'success' | 'info';
  onClose: () => void;
}

const config = {
    error: {
        Icon: ErrorIcon,
        bgColor: 'bg-error',
    },
    success: {
        Icon: CheckCircleIcon,
        bgColor: 'bg-success',
    },
    info: {
        Icon: InfoIcon,
        bgColor: 'bg-info',
    }
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // allow for fade-out animation
        }, 5000);

        return () => clearTimeout(timer);
    }, [message, onClose]);

    const { Icon, bgColor } = config[type];

    return (
        <div
            className={`fixed bottom-5 right-5 ${bgColor} text-white p-4 rounded-lg shadow-lg flex items-center gap-3 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'} z-50`}
            role="alert"
        >
            <Icon className="w-6 h-6" />
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 text-xl font-bold leading-none">&times;</button>
        </div>
    );
};
