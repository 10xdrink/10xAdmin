import api from '../utils/api';
import { setAuthToken, removeAuthToken } from '../utils/auth';

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise} Promise object with user data
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    // Save the token to localStorage
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise} Promise object
 */
export const logout = async () => {
  try {
    // Call the logout endpoint to invalidate the token on the server
    await api.post('/auth/logout');
    
    // Remove the token from localStorage
    removeAuthToken();
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove the token locally even if the server request fails
    removeAuthToken();
    throw error;
  }
};

/**
 * Get current user profile
 * @returns {Promise} Promise object with user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} userData - User data to update
 * @returns {Promise} Promise object with updated user data
 */
export const updateProfile = async (userData) => {
  try {
    // Create FormData for file upload support
    const formData = new FormData();
    
    // Append all user data to FormData
    Object.keys(userData).forEach(key => {
      // Skip null, undefined, or empty values except for falsy values like '0' or false
      if (userData[key] === null || userData[key] === undefined || userData[key] === '') {
        return;
      }
      
      // For files, append directly
      if (key === 'profilePicture' && userData[key] instanceof File) {
        formData.append(key, userData[key]);
      } else {
        // For other data, stringify objects if needed
        formData.append(key, typeof userData[key] === 'object' && !(userData[key] instanceof File) 
          ? JSON.stringify(userData[key]) 
          : userData[key]);
      }
    });
    
    const response = await api.put('/auth/update-profile', formData);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
}; 