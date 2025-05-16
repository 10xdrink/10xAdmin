/**
 * Base URL for API requests
 * 
 * In development, all API requests are proxied through Vite's development server
 * to avoid CORS issues. The vite.config.js file has proxy settings that forward
 * requests to the backend.
 * 
 * In production, this would be updated to the actual API endpoint
 */
const API_BASE_URL = '/api';

export default API_BASE_URL; 