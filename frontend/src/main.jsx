import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';

// Get the root DOM element from index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main application
root.render(
  <React.StrictMode>
    {/* BrowserRouter enables client-side routing for the application */}
    <BrowserRouter>
      {/* AuthProvider makes authentication state and functions available to the entire app */}
      <AuthProvider>
        {/* App is the main component of the application */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
