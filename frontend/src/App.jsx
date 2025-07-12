import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SwapRequestsPage from './pages/SwapRequestsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute'; // Import AdminRoute
import AdminDashboard from './pages/AdminDashboard'; // Import AdminDashboard
import Notification from './components/Notification';
import { useAuth } from './context/AuthContext';

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
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected User Routes */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/swaps" element={<ProtectedRoute><SwapRequestsPage /></ProtectedRoute>} />
          
          {/* --- NEW: Admin Route --- */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </main>
      <Notification message={notification.message} show={notification.show} type={notification.type} />
    </div>
  );
}

export default App;
