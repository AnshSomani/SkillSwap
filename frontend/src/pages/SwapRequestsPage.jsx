import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Search, Trash2, Star } from 'lucide-react';
import { ConfirmModal, RatingModal } from '../components/Modals';
import SkillTag from '../components/SkillTag';

const SwapRequestsPage = () => {
    const { currentUser, showNotification } = useAuth();
    const [swaps, setSwaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [swapToDelete, setSwapToDelete] = useState(null);
    const [swapToRate, setSwapToRate] = useState(null);

    const fetchSwaps = async () => {
        try {
            const { data } = await api.get('/swaps');
            setSwaps(data);
        } catch (error) {
            console.error("Failed to fetch swaps", error);
            showNotification("Could not load swap requests.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchSwaps();
        }
    }, [currentUser]);

    const handleUpdateStatus = async (swapId, status) => {
        try {
            await api.put(`/swaps/${swapId}`, { status });
            showNotification(`Request ${status}.`);
            fetchSwaps();
        } catch (error) {
            console.error("Failed to update status", error);
            showNotification("Failed to update request status.", "error");
        }
    };

    const handleDeleteClick = (swapId) => {
        setSwapToDelete(swapId);
    };

    const handleDeleteConfirm = async () => {
        if (swapToDelete) {
            try {
                await api.delete(`/swaps/${swapToDelete}`);
                showNotification("Request deleted successfully.");
                setSwapToDelete(null);
                fetchSwaps();
            } catch (error) {
                console.error("Failed to delete swap", error);
                showNotification("Failed to delete request.", "error");
                setSwapToDelete(null);
            }
        }
    };

    const handleRateSubmit = async ({ rating, feedback }) => {
        if (!swapToRate) return;
        try {
            await api.post(`/swaps/${swapToRate._id}/rate`, { rating, feedback });
            showNotification('Rating submitted successfully!');
            setSwapToRate(null);
            fetchSwaps();
        } catch (error) {
            console.error('Failed to submit rating', error);
            showNotification('Failed to submit rating.', 'error');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-yellow-400';
            case 'accepted': return 'text-green-400';
            case 'rejected': return 'text-red-400';
            case 'completed': return 'text-cyan-400'; // Changed to a brighter color
            default: return 'text-gray-400';
        }
    };
    
    // UPDATED: Added a filter to ensure both users in a swap exist before proceeding
    const filteredSwaps = swaps
        .filter(swap => swap.requester && swap.responder) // This check prevents the crash
        .filter(swap => {
            const otherUser = swap.requester._id === currentUser._id ? swap.responder : swap.requester;
            const nameMatch = otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
            const statusMatch = filter === 'all' || swap.status === filter;
            return nameMatch && statusMatch;
    });

    if (loading) return <p className="text-center text-white mt-8">Loading requests...</p>;

    return (
        <div className="p-4 md:p-8">
            {swapToDelete && (
                <ConfirmModal
                    title="Delete Swap Request"
                    message="Are you sure you want to permanently delete this request?"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setSwapToDelete(null)}
                />
            )}
            {swapToRate && (
                <RatingModal 
                    onClose={() => setSwapToRate(null)}
                    onSubmit={handleRateSubmit}
                />
            )}
            <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Swap Requests</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-1/3"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                    </select>
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search by user name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredSwaps.length > 0 ? filteredSwaps.map(swap => {
                        const isResponder = swap.responder._id === currentUser._id;
                        const otherUser = isResponder ? swap.requester : swap.responder;

                        return (
                            <div key={swap._id} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col md:flex-row items-center gap-6">
                                <img src={otherUser.profilePhoto} alt={otherUser.name} className="w-24 h-24 rounded-full border-4 border-gray-600" />
                                <div className="flex-grow text-center md:text-left">
                                    <h3 className="text-xl font-bold text-white">{otherUser.name}</h3>
                                    <div className="text-sm text-gray-400 mt-2 space-y-2">
                                        <div>
                                            <p>{isResponder ? `${otherUser.name} requests:` : `You requested:`}</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {swap.responderSkills.map(skill => <SkillTag key={skill} skill={skill} />)}
                                            </div>
                                        </div>
                                        <div>
                                            <p>In exchange for:</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {swap.requesterSkills.map(skill => <SkillTag key={skill} skill={skill} />)}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mt-3 italic">"{swap.message}"</p>
                                </div>
                                <div className="flex flex-col items-center space-y-2">
                                    {/* UPDATED: Added text color to the label */}
                                    <p className="font-bold text-lg text-gray-300">Status: <span className={getStatusColor(swap.status)}>{swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}</span></p>
                                    {isResponder && swap.status === 'pending' && (
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleUpdateStatus(swap._id, 'accepted')} className="text-green-400 hover:text-green-300 font-bold">Accept</button>
                                            <button onClick={() => handleUpdateStatus(swap._id, 'rejected')} className="text-red-400 hover:text-red-300 font-bold">Reject</button>
                                        </div>
                                    )}
                                    {!isResponder && swap.status === 'pending' && (
                                        <button onClick={() => handleDeleteClick(swap._id)} className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1">
                                            <Trash2 size={16} /> Delete Request
                                        </button>
                                    )}
                                    {swap.status === 'accepted' && (
                                        <button onClick={() => setSwapToRate(swap)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                                            <Star size={16} />
                                            <span>Complete & Rate</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    }) : (
                        <p className="text-center text-gray-400 py-8">No swap requests found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SwapRequestsPage;
