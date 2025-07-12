import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const Notification = ({ message, show, type = 'success' }) => {
    if (!show) return null;

    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const Icon = type === 'success' ? CheckCircle : XCircle;

    return (
        <div className={`fixed bottom-5 right-5 text-white py-3 px-5 rounded-lg shadow-lg flex items-center z-50 animate-fade-in-out ${bgColor}`}>
            <Icon className="mr-3" size={24} />
            <p>{message}</p>
        </div>
    );
};

export default Notification;
