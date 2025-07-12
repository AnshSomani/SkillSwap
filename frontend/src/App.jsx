import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SwapRequestsPage from './pages/SwapRequestsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Notification from './components/Notification';
import { useAuth } from './context/AuthContext';

function App() {
  // Access the notification state from the authentication context
  const { notification } = useAuth();
  
  return (
    // Main container with a dark background and default font
    <div className="bg-gray-900 min-h-screen font-sans">
      {/* Inline style for the notification's fade-in-out animation */}
      <style>{`
          @keyframes fade-in-out {
              0% { opacity: 0; transform: translateY(20px); }
              10% { opacity: 1; transform: translateY(0); }
              90% { opacity: 1; transform: translateY(0); }
              100% { opacity: 0; transform: translateY(20px); }
          }
          .animate-fade-in-out {
              animation: fade-in-out 3s ease-in-out forwards;
          }
      `}</style>
      
      {/* The Header component is displayed on all pages */}
      <Header />
      
      <main>
        {/* The Routes component from react-router-dom handles all page routing */}
        <Routes>
          {/* Public routes accessible to everyone */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes that require a user to be logged in */}
          {/* The ProtectedRoute component wraps these pages to enforce authentication */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/swaps" 
            element={
              <ProtectedRoute>
                <SwapRequestsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      
      {/* The Notification component is displayed globally, controlled by the AuthContext */}
      <Notification 
        message={notification.message} 
        show={notification.show} 
        type={notification.type} 
      />
    </div>
  );
}

export default App;
