import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    // Show a loading indicator while the authentication status is being checked
    if (loading) {
        return <p className="text-center text-white mt-8">Loading...</p>;
    }

    // If a user is logged in, redirect them away from the public page (e.g., login page) to the homepage.
    // Otherwise, show the public page (the children components).
    return currentUser ? <Navigate to="/" /> : children;
};

export default PublicRoute;
