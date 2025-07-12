import axios from 'axios';

const api = axios.create({
    // UPDATED: No need for a full base URL. 
    // The proxy will handle it in development, and in production,
    // it will correctly point to the same host.
    baseURL: '/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to handle token expiration or other auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
