/**
 * Gets the authentication token from localStorage
 * @returns {string|null} The auth token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Saves the authentication token to localStorage
 * @param {string} token - The auth token to save
 */
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

/**
 * Removes the authentication token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Checks if a user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Logs out the user by removing the auth token and redirecting to login
 */
export const logout = () => {
  removeAuthToken();
  window.location.href = '/login';
}; 