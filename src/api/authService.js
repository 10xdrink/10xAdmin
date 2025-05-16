// src/api/authService.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

const authService = {
  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>} Response data containing token or OTP requirement
   */
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, { // Corrected endpoint path
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to login');
    }

    return data;
  },

  /**
   * Verify OTP
   * @param {string} email
   * @param {string} otp
   * @returns {Promise<object>} Response data containing token
   */
  verifyOTP: async (email, otp) => {
    const response = await fetch(`${API_URL}/auth/verify-otp`, { // Corrected endpoint path
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify OTP');
    }

    return data;
  },

  /**
   * Resend OTP
   * @param {string} email
   * @returns {Promise<object>} Response data with success message
   */
  resendOTP: async (email) => {
    const response = await fetch(`${API_URL}/auth/resend-otp`, { // Corrected endpoint path
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to resend OTP');
    }

    return data;
  },

  /**
   * Logout user
   * @returns {Promise<object>} Response data with success message
   */
  logout: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/auth/logout`, { // Corrected endpoint path
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // If your backend requires auth for logout
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to logout');
    }

    return data;
  },

  /**
   * Register new user
   * @param {object} userData - { name, email, password, role, adminSecretKey }
   * @returns {Promise<object>} Response data containing registered user and token
   */
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, { // Corrected endpoint path
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to register');
    }

    return data;
  },

  /**
   * Get current logged-in user
   * @param {string} token - JWT token
   * @returns {Promise<object>} Response data containing user information
   */
  getMe: async (token) => {
    const response = await fetch(`${API_URL}/auth/me`, { // Corrected endpoint path
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user data');
    }

    return data;
  },

  // Add more authentication-related functions as needed (e.g., forgotPassword, resetPassword)
};

export default authService;
