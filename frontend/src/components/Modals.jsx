import React, { useState } from 'react';
import { X, Star } from 'lucide-react';

// ... (LoginModal, RequestModal, and ConfirmModal are the same)

export const LoginModal = ({ onLogin, onSwitchToRegister }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-white w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-center">Login Required</h2>
            <p className="text-center mb-6 text-gray-300">You need to be logged in to request a swap.</p>
            <button onClick={onLogin} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Go to Login
            </button>
            <p className="text-center mt-4 text-sm text-gray-400">
                New here? <button onClick={onSwitchToRegister} className="text-purple-400 hover:underline">Create an account</button>
            </p>
        </div>
    </div>
);

export const RequestModal = ({ currentUser, targetUser, onSwapRequest, onClose }) => {
    const [requesterSkill, setRequesterSkill] = useState(currentUser.skillsOffered[0] || '');
    const [responderSkill, setResponderSkill] = useState(targetUser.skillsWanted[0] || '');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!requesterSkill || !responderSkill || !message) {
            console.error("Please fill all fields.");
            return;
        }
        onSwapRequest({
            responderId: targetUser._id,
            requesterSkill,
            responderSkill,
            message,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Send Swap Request to {targetUser.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Choose one of your offered skills</label>
                        <select value={requesterSkill} onChange={(e) => setRequesterSkill(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                            {currentUser.skillsOffered.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Choose one of their wanted skills</label>
                        <select value={responderSkill} onChange={(e) => setResponderSkill(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                            {targetUser.skillsWanted.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="4" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Introduce yourself and explain why you'd like to swap skills..."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export const ConfirmModal = ({ title, message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-white w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
            <p className="text-center mb-6 text-gray-300">{message}</p>
            <div className="flex justify-center space-x-4">
                <button onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                    Cancel
                </button>
                <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                    Confirm
                </button>
            </div>
        </div>
    </div>
);

// --- NEW RATING MODAL ---
export const RatingModal = ({ onSubmit, onClose }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a rating.");
            return;
        }
        onSubmit({ rating, feedback });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Complete Swap & Leave a Rating</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 text-center">Your Rating</label>
                        <div className="flex justify-center items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={32}
                                    className={`cursor-pointer transition-colors ${
                                        (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-600'
                                    }`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Feedback (Optional)</label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows="4"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="How was your experience with this user?"
                        ></textarea>
                    </div>
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        Submit Rating & Complete
                    </button>
                </form>
            </div>
        </div>
    );
};
