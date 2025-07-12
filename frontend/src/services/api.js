import axios from 'axios';

// Create a new axios instance with a base configuration
const api = axios.create({
    // The base URL for all API requests is read from the environment variables
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Use an interceptor to handle responses globally
// This is useful for handling common errors like authentication failures
api.interceptors.response.use(
  // The first function handles successful responses (status 2xx)
  // We just pass the response through
  (response) => response,
  // The second function handles error responses
  (error) => {
    // Check if the error is a 401 Unauthorized status
    if (error.response && error.response.status === 401) {
      // If the user is not authorized, it likely means their token is invalid or expired
      // Remove the token from local storage
      localStorage.removeItem('token');
      // Redirect the user to the login page to re-authenticate
      // We check the pathname to avoid a redirect loop if the user is already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // Return the error to be handled by the specific component that made the call (e.g., to show an error message)
    return Promise.reject(error);
  }
);

export default api;
