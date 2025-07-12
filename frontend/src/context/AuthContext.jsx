import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
// CORRECTED IMPORT: Removed the curly braces {}
import jwtDecode from 'jwt-decode';

// Create a new context for authentication
const AuthContext = createContext();

// Custom hook to make it easier to use the auth context in other components
export const useAuth = () => {
    return useContext(AuthContext);
};

// The AuthProvider component will wrap the entire application
export const AuthProvider = ({ children }) => {
    // State to hold the currently logged-in user's data
    const [currentUser, setCurrentUser] = useState(null);
    // State to track if the initial authentication check is complete
    const [loading, setLoading] = useState(true);
    // State for showing notifications across the app
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    // This effect runs once when the app loads to check for an existing token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode the token to check its expiration
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    // If token is valid, set it in the default headers for all future api calls
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    // Fetch the user's data from the backend
                    api.get('/auth/me')
                        .then(res => setCurrentUser(res.data))
                        .catch(() => {
                            // If fetching fails, remove the bad token
                            localStorage.removeItem('token');
                            setCurrentUser(null);
                        });
                } else {
                    // If token is expired, remove it
                    localStorage.removeItem('token');
                }
            } catch (error) {
                // If token is malformed, remove it
                localStorage.removeItem('token');
                console.error("Invalid token");
            }
        }
        // Set loading to false once the check is complete
        setLoading(false);
    }, []);

    // Function to display a notification for 3 seconds
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: 'success' });
        }, 3000);
    };

    // Function to handle user login
    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        const userRes = await api.get('/auth/me');
        setCurrentUser(userRes.data);
        return userRes.data;
    };
    
    // Function to handle new user registration
    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        const userRes = await api.get('/auth/me');
        setCurrentUser(userRes.data);
        return userRes.data;
    }

    // Function to handle user logout
    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setCurrentUser(null);
    };
    
    // Function to update the current user's data in the context (e.g., after a profile update)
    const updateUser = (user) => {
        setCurrentUser(user);
    }

    // The value object contains all the state and functions to be provided to consuming components
    const value = {
        currentUser,
        loading,
        notification,
        login,
        register,
        logout,
        updateUser,
        showNotification,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Only render the children (the rest of the app) when the initial loading is done */}
            {!loading && children}
        </AuthContext.Provider>
    );
};
