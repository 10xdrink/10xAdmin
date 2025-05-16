import axios from 'axios';
import { getAuthToken } from './auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increased timeout for larger file uploads
});

// Request interceptor to attach auth token and handle content types
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData (multipart/form-data)
    // Let the browser set it with the boundary parameter
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    // Handle specific HTTP errors
    if (response) {
      // Unauthorized - token expired or invalid
      if (response.status === 401) {
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
      }
      
      // Log all API errors for debugging
      console.error('API Error:', response.config.url, response.status, response.data);
    } else {
      // Network error or server down
      console.error('Network Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api; 