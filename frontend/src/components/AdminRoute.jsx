import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <p className="text-center text-white mt-8">Loading...</p>;
    }

    // Check if user exists, is logged in, and has the 'admin' role
    return currentUser && currentUser.role === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;
