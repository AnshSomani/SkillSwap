import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut } from 'lucide-react';

const Header = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white cursor-pointer" onClick={() => navigate('/')}>
                Skill Swap Platform
            </h1>
            <nav className="flex items-center space-x-4">
                {currentUser ? (
                    <>
                        <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
                        <Link to="/swaps" className="text-gray-300 hover:text-white transition">Swap Requests</Link>
                        <Link to="/profile" className="flex items-center space-x-2 text-gray-300 hover:text-white transition">
                            <img src={currentUser.profilePhoto} alt="Profile" className="w-8 h-8 rounded-full border-2 border-purple-500" />
                            <span>{currentUser.name}</span>
                        </Link>
                        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
                        <Link to="/login" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                            <LogIn size={16} />
                            <span>Login</span>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
