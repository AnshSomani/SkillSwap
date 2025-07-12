import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Rating from '../components/Rating';
import SkillTag from '../components/SkillTag';
import Pagination from '../components/Pagination';
import { RequestModal, LoginModal } from '../components/Modals';

const HomePage = () => {
    const { currentUser, showNotification } = useAuth();
    const navigate = useNavigate();
    
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [availability, setAvailability] = useState('All');
    
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [targetUserForSwap, setTargetUserForSwap] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 3;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/users');
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch users", error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        // UPDATED: Added a filter to exclude admin users from the list
        let result = users.filter(u => u._id !== currentUser?._id && u.role !== 'admin');

        if (searchQuery) {
            result = result.filter(u =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.skillsOffered.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                u.skillsWanted.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (availability !== 'All') {
            result = result.filter(u => u.availability === availability);
        }

        setFilteredUsers(result);
        setCurrentPage(1);
    }, [users, searchQuery, availability, currentUser]);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    const handleRequestClick = (user) => {
        if (!currentUser) {
            setShowLoginModal(true);
        } else {
            setTargetUserForSwap(user);
        }
    };
    
    const handleSwapRequest = async (swapData) => {
        try {
            await api.post('/swaps', swapData);
            showNotification("Swap request sent successfully!");
            setTargetUserForSwap(null);
            navigate('/swaps');
        } catch (error) {
            console.error("Failed to send swap request", error);
            showNotification("Failed to send request. Please try again.", "error");
        }
    };

    if (loading) return <p className="text-center text-white mt-8">Loading users...</p>;

    return (
        <div className="p-4 md:p-8">
            {showLoginModal && <LoginModal onLogin={() => navigate('/login')} onSwitchToRegister={() => navigate('/register')} />}
            {targetUserForSwap && <RequestModal currentUser={currentUser} targetUser={targetUserForSwap} onClose={() => setTargetUserForSwap(null)} onSwapRequest={handleSwapRequest} />}

            <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-1/3"
                    >
                        <option value="All">All Availabilities</option>
                        <option value="Weekends">Weekends</option>
                        <option value="Evenings">Evenings</option>
                        <option value="Weekdays">Weekdays</option>
                    </select>
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search by skill (e.g., 'Photoshop' or 'Excel')"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="space-y-4">
                    {paginatedUsers.length > 0 ? paginatedUsers.map(user => (
                        <div key={user._id} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col md:flex-row items-center gap-6">
                            <img src={user.profilePhoto} alt={user.name} className="w-24 h-24 rounded-full border-4 border-gray-600" />
                            <div className="flex-grow text-center md:text-left">
                                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-400">Skills Offered:</p>
                                    <div className="flex flex-wrap gap-2 mt-1 justify-center md:justify-start">
                                        {user.skillsOffered.map(skill => <SkillTag key={skill} skill={skill} />)}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-400">Skills Wanted:</p>
                                    <div className="flex flex-wrap gap-2 mt-1 justify-center md:justify-start">
                                        {user.skillsWanted.map(skill => <SkillTag key={skill} skill={skill} />)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center space-y-4">
                                <Rating value={user.avgRating} />
                                <button
                                    onClick={() => handleRequestClick(user)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                                >
                                    Request
                                </button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-400 py-8">No users found matching your criteria.</p>
                    )}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
};

export default HomePage;
