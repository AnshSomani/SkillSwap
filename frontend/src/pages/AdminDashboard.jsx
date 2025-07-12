import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, Repeat, Slash } from 'lucide-react';

const AdminDashboard = () => {
    const [view, setView] = useState('users'); // 'users' or 'swaps'
    const [users, setUsers] = useState([]);
    const [swaps, setSwaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useAuth();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, swapsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/swaps')
            ]);
            setUsers(usersRes.data);
            setSwaps(swapsRes.data);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
            showNotification("Could not load admin data.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleBan = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/ban`);
            showNotification('User status updated successfully!');
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Failed to update user status', error);
            showNotification('Failed to update user status.', 'error');
        }
    };

    return (
        <div className="p-4 md:p-8 text-white">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 flex items-center"><Shield size={36} className="mr-3 text-yellow-400"/>Admin Dashboard</h1>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex border-b border-gray-700 mb-6">
                        <button onClick={() => setView('users')} className={`px-4 py-2 text-lg font-semibold transition ${view === 'users' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}>
                            <Users size={20} className="inline-block mr-2"/>User Management
                        </button>
                        <button onClick={() => setView('swaps')} className={`px-4 py-2 text-lg font-semibold transition ${view === 'swaps' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}>
                            <Repeat size={20} className="inline-block mr-2"/>Swap Monitoring
                        </button>
                    </div>

                    {loading ? <p>Loading data...</p> : (
                        <div>
                            {view === 'users' && <UserManagementTable users={users} onToggleBan={handleToggleBan} />}
                            {view === 'swaps' && <SwapMonitoringTable swaps={swaps} />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const UserManagementTable = ({ users, onToggleBan }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead>
                <tr className="border-b border-gray-600">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.role}</td>
                        <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isBanned ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                                {user.isBanned ? 'Banned' : 'Active'}
                            </span>
                        </td>
                        <td className="p-3">
                            {user.role !== 'admin' && (
                                <button onClick={() => onToggleBan(user._id)} className={`flex items-center text-sm font-bold py-1 px-3 rounded ${user.isBanned ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                    <Slash size={14} className="mr-1"/> {user.isBanned ? 'Unban' : 'Ban'}
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const SwapMonitoringTable = ({ swaps }) => (
     <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead>
                <tr className="border-b border-gray-600">
                    <th className="p-3">Requester</th>
                    <th className="p-3">Responder</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                </tr>
            </thead>
            <tbody>
                {swaps.map(swap => (
                    <tr key={swap._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="p-3">{swap.requester.name}</td>
                        <td className="p-3">{swap.responder.name}</td>
                        <td className="p-3 font-semibold">{swap.status.toUpperCase()}</td>
                        <td className="p-3 text-sm text-gray-400">{new Date(swap.createdAt).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default AdminDashboard;
