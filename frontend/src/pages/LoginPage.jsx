import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, showNotification } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            showNotification('Logged in successfully!');
            navigate('/');
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to login. Please check your credentials.';
            setError(message);
            showNotification(message, 'error');
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-md mx-auto bg-gray-800 border border-gray-700 rounded-lg p-8 mt-10">
                <h2 className="text-3xl font-bold text-white text-center mb-6">User Login</h2>
                {error && <p className="bg-red-900 border border-red-700 text-red-200 p-3 rounded-lg mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>
                    <div className="text-right">
                        <a href="#" className="text-sm text-blue-400 hover:underline">Forgot username/password?</a>
                    </div>
                    <div>
                        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                            Login
                        </button>
                    </div>
                </form>
                <p className="text-center mt-6 text-gray-400">
                    Don't have an account? <Link to="/register" className="text-purple-400 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
