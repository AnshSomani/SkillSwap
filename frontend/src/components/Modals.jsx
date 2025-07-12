import React, { useState, useEffect } from 'react';
import { X, Star, Trash2 } from 'lucide-react';
import SkillTag from './SkillTag'; // Import SkillTag

// ... (LoginModal, RequestModal, ConfirmModal, RatingModal are the same)
// I'm adding a new EditUserModal at the end

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
    const [requesterSkills, setRequesterSkills] = useState([]);
    const [responderSkills, setResponderSkills] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSkillToggle = (skill, list, setList) => {
        setError('');
        setList(prev => 
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (requesterSkills.length === 0 || responderSkills.length === 0 || !message) {
            setError("Please select at least one skill to offer, one to request, and write a message.");
            return;
        }
        setError('');
        onSwapRequest({
            responderId: targetUser._id,
            requesterSkills,
            responderSkills,
            message,
        });
    };

    const SkillCheckbox = ({ skill, isSelected, onToggle }) => (
        <label className={`inline-flex items-center justify-center px-3 py-2 border rounded-full cursor-pointer transition-colors ${isSelected ? 'bg-purple-600 border-purple-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}>
            <input type="checkbox" className="hidden" checked={isSelected} onChange={() => onToggle(skill)} />
            <span>{skill}</span>
        </label>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Send Swap Request to {targetUser.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Choose skills you'll offer:</label>
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-900 rounded-lg">
                            {currentUser.skillsOffered.map(skill => (
                                <SkillCheckbox 
                                    key={skill} 
                                    skill={skill} 
                                    isSelected={requesterSkills.includes(skill)}
                                    onToggle={(s) => handleSkillToggle(s, requesterSkills, setRequesterSkills)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Choose skills you want:</label>
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-900 rounded-lg">
                             {targetUser.skillsWanted.map(skill => (
                                <SkillCheckbox 
                                    key={skill} 
                                    skill={skill} 
                                    isSelected={responderSkills.includes(skill)}
                                    onToggle={(s) => handleSkillToggle(s, responderSkills, setResponderSkills)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="4" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Introduce yourself and explain why you'd like to swap skills..."></textarea>
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
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

// --- NEW MODAL FOR EDITING USERS ---
export const EditUserModal = ({ user, onSave, onDelete, onClose }) => {
    const [userData, setUserData] = useState(user);

    const handleSkillRemove = (skillToRemove, type) => {
        if (type === 'offered') {
            setUserData({ ...userData, skillsOffered: userData.skillsOffered.filter(s => s !== skillToRemove) });
        } else {
            setUserData({ ...userData, skillsWanted: userData.skillsWanted.filter(s => s !== skillToRemove) });
        }
    };

    const handleSaveChanges = () => {
        onSave(userData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Edit User: {user.name}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Skills Offered</label>
                        <div className="flex flex-wrap gap-2 p-2 bg-gray-900 rounded-lg border border-gray-600 min-h-[40px]">
                            {userData.skillsOffered.map(skill => <SkillTag key={skill} skill={skill} onRemove={(s) => handleSkillRemove(s, 'offered')} editable />)}
                            {userData.skillsOffered.length === 0 && <p className="text-gray-500 text-sm p-1">No skills offered.</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Skills Wanted</label>
                        <div className="flex flex-wrap gap-2 p-2 bg-gray-900 rounded-lg border border-gray-600 min-h-[40px]">
                            {userData.skillsWanted.map(skill => <SkillTag key={skill} skill={skill} onRemove={(s) => handleSkillRemove(s, 'wanted')} editable />)}
                            {userData.skillsWanted.length === 0 && <p className="text-gray-500 text-sm p-1">No skills wanted.</p>}
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-between items-center">
                     <button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                        Save Changes
                    </button>
                    <button onClick={() => onDelete(user._id)} className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-300">
                        <Trash2 size={16} />
                        <span>Delete User</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
