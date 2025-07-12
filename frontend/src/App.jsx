import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SwapRequestsPage from './pages/SwapRequestsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import Notification from './components/Notification';
import { useAuth } from './context/AuthContext';
import PublicRoute from './components/PublicRoute'; // Import the new PublicRoute

function App() {
  const { notification } = useAuth();
  
  return (
    <div className="bg-gray-900 min-h-screen font-sans">
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
      <Header />
      <main>
        <Routes>
          {/* Public route accessible to everyone */}
          <Route path="/" element={<HomePage />} />
          
          {/* --- UPDATED: These routes are now for logged-out users only --- */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />
          
          {/* Protected routes for logged-in users */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/swaps" element={<ProtectedRoute><SwapRequestsPage /></ProtectedRoute>} />
          
          {/* Protected route for admin users only */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </main>
      <Notification message={notification.message} show={notification.show} type={notification.type} />
    </div>
  );
}

export default App;
