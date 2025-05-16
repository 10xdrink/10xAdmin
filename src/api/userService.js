// src/api/userService.js

import axios from "axios";

// Base URL from environment variables or default to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create an axios instance for user operations
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the auth token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminToken") || localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Fetch all users with optional query parameters (search, filter, pagination)
 * @param {Object} params - Query parameters for filtering, searching, and pagination
 * @returns {Object} - Response data containing users and additional info
 */
export const getUsers = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/users/admin/users", { params });
    return response.data; // Expected to return { success: true, count: n, data: [...users], totalPages: x }
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch users.";
  }
};

/**
 * Fetch a single user by ID
 * @param {String} id - User ID
 * @returns {Object} - Response data containing user details
 */
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/users/admin/users/${id}`);
    return response.data; // Expected to return { success: true, data: {...user} }
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch user details.";
  }
};

/**
 * Create a new user with form data (including profile picture)
 * @param {FormData} userData - FormData object containing user details and optional profile picture
 * @returns {Object} - Response data containing created user details
 */
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/users/admin/users", userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Expected to return { success: true, data: {...user} }
  } catch (error) {
    throw error.response?.data?.message || "Failed to create user.";
  }
};

/**
 * Update an existing user's details with special handling for role validation issues
 * @param {String} id - User ID
 * @param {FormData} userData - FormData object containing updated user details and optional profile picture
 * @returns {Object} - Response data containing updated user details
 */
export const updateUser = async (id, userData) => {
  try {
    // Log the formData contents for debugging
    console.log('Updating user with ID:', id);
    console.log('userData instanceof FormData:', userData instanceof FormData);
    
    // Create a debug log of the form data contents
    const formDataEntries = {};
    if (userData instanceof FormData) {
      for (let [key, value] of userData.entries()) {
        formDataEntries[key] = value;
      }
      console.log('FormData contents:', formDataEntries);
    }
    
    // Special handling for 'role' field to address backend validation issues
    if (userData instanceof FormData && userData.has('role')) {
      const role = userData.get('role');
      console.log('Role value being sent:', role);
      
      // Handle special case for 'user' role which might have validation issues
      if (role === 'user') {
        console.log('Warning: Role is being set to "user" which may cause validation issues');
        
        // Try using alternative value if provided, or keep as is
        // This allows the form component to provide workarounds
      } else if (role === 'User' || role === 'regular-user') {
        console.log('Using alternative format for user role:', role);
      }
    }
    
    const response = await axiosInstance.put(
      `/users/admin/users/${id}`,
      userData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; // Expected to return { success: true, data: {...user} }
  } catch (error) {
    console.error('Update user error:', error.response?.data || error);
    
    // Special handling for role validation errors from the backend
    if (error.response?.data?.validationErrors) {
      const roleError = error.response.data.validationErrors.find(e => 
        e.field === 'role' && e.message.includes('Invalid user role')
      );
      
      if (roleError) {
        console.error('Role validation error detected:', roleError);
        // Let the frontend handle the specific error since it contains the workarounds
      }
    }
    
    throw error.response?.data?.message || "Failed to update user.";
  }
};

/**
 * Soft delete or deactivate a user
 * @param {String} id - User ID
 * @returns {Object} - Response data confirming deactivation
 */
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/users/admin/users/${id}`);
    return response.data; // Expected to return { success: true, message: 'User deactivated successfully' }
  } catch (error) {
    throw error.response?.data?.message || "Failed to deactivate user.";
  }
};

/**
 * Reset a user's password (Admin-initiated)
 * @param {String} id - User ID
 * @param {String} newPassword - New password string
 * @returns {Object} - Response data confirming password reset
 */
export const resetUserPassword = async (id, newPassword) => {
  try {
    const response = await axiosInstance.post(
      `/users/admin/users/${id}/reset-password`,
      { password: newPassword }
    );
    return response.data; // Expected to return { success: true, message: 'User password reset successfully' }
  } catch (error) {
    throw error.response?.data?.message || "Failed to reset password.";
  }
};

/**
 * Search users with specific criteria
 * @param {Object} searchParams - Parameters for searching (e.g., name, email, role, createdFrom, createdTo)
 * @returns {Object} - Response data containing filtered users
 */
export const searchUsers = async (searchParams) => {
  try {
    const response = await axiosInstance.get("/users/admin/users/search", {
      params: searchParams,
    });
    return response.data; // Expected to return { success: true, users: [...], totalPages: n }
  } catch (error) {
    throw error.response?.data?.message || "Failed to search users.";
  }
};

/**
 * Export user data in specified format (CSV/Excel)
 * @param {String} format - Desired export format ('csv' or 'excel')
 * @param {Array} userIds - (Optional) Array of user IDs to export
 * @returns {Blob} - Blob data for file download
 */
export const exportUsers = async (format = "csv", userIds = []) => {
  try {
    const params = { format };
    if (userIds.length > 0) {
      params.userIds = userIds;
    }
    const response = await axiosInstance.get("/users/admin/users/export", {
      responseType: "blob", // Important for handling file downloads
      params,
    });
    return response.data; // Blob data for file download
  } catch (error) {
    throw error.response?.data?.message || "Failed to export users.";
  }
};

/**
 * Activate or deactivate a user
 * @param {String} id - User ID
 * @param {Boolean} isActive - Desired active status
 * @returns {Object} - Response data containing updated user details
 */
export const changeUserStatus = async (id, isActive) => {
  try {
    const response = await axiosInstance.patch(
      `/users/admin/users/${id}/status`,
      { isActive }
    );
    return response.data; // Expected to return { success: true, user: {...user} }
  } catch (error) {
    throw error.response?.data?.message || "Failed to change user status.";
  }
};

/**
 * Perform bulk updates on multiple users
 * @param {Object} bulkData - Object containing userIds and actions
 * @param {Array} bulkData.userIds - Array of user IDs
 * @param {Array} bulkData.actions - Array of action objects
 * @returns {Object} - Response data confirming bulk update
 */
export const bulkUpdateUsers = async ({ userIds, actions }) => {
  try {
    const response = await axiosInstance.post(
      "/users/admin/users/bulk-update",
      { userIds, actions }
    );
    return response.data; // Expected to return { success: true, message: 'Bulk update successful', result: {...} }
  } catch (error) {
    throw error.response?.data?.message || "Failed to perform bulk update.";
  }
};

/**
 * Get recent login activity for a user
 * @param {String} id - User ID
 * @returns {Object} - Response data containing recent login activities
 */
export const getUserActivity = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/users/admin/users/${id}/activity`
    );
    return response.data; // Expected to return { success: true, activities: [...] }
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch user activity.";
  }
};

/**
 * Get user counts grouped by roles
 * @returns {Array} - Array of role counts
 */
export const countUsersByRole = async () => {
  try {
    console.log('Fetching user counts by role...');
    const response = await axiosInstance.get(
      "/users/admin/users/count-by-role"
    );
    console.log('Raw countUsersByRole response:', response.data);
    
    // Check if response has the expected structure
    if (response.data && response.data.success && Array.isArray(response.data.counts)) {
      return response.data.counts;
    }
    // Handle other formats that might exist
    else if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    else {
      console.warn("Unexpected response format from countUsersByRole:", response.data);
      return []; // Return a safe fallback
    }
  } catch (error) {
    console.error("Failed to count users by role:", error);
    // Try to extract more info from the error
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    return []; // Return a safe fallback instead of throwing
  }
};

/**
 * Get total number of users
 * @returns {Number} - Total user count
 */
export const getUserCount = async () => {
  try {
    console.log('Fetching total user count...');
    const response = await axiosInstance.get("/users/admin/users/count");
    console.log('Raw getUserCount response:', response.data);
    
    // Check if response has the expected structure
    if (response.data && response.data.success && typeof response.data.count === 'number') {
      return response.data.count;
    } 
    // Try to handle other response formats
    else if (response.data && typeof response.data.totalUsers === 'number') {
      return response.data.totalUsers;
    }
    else if (response.data && typeof response.data === 'number') {
      return response.data;
    }
    else {
      console.warn("Unexpected response format from getUserCount:", response.data);
      return 0; // Return a safe fallback
    }
  } catch (error) {
    console.error("Failed to get total user count:", error);
    // Try to extract more info from the error
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    return 0; // Return a safe fallback instead of throwing
  }
};

/**
 * Get audit logs for a user
 * @param {String} id - User ID
 * @returns {Object} - Response data containing audit logs
 */
export const getUserAuditLogs = async (id) => {
  try {
    const response = await axiosInstance.get(`/users/admin/users/${id}/audit`);
    return response.data; // Expected to return { success: true, auditLogs: [...] }
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch audit logs.";
  }
};

/**
 * Invite a new user by email and role
 * @param {string} email - Email of the user to invite
 * @param {string} role - Role to assign to the invited user
 * @returns {Object} - Response data from the invitation API
 */
export const inviteUser = async (email, role) => {
  try {
    const response = await axiosInstance.post("/users/admin/users/invite", {
      email,
      role,
    });
    return response.data; // Expected to return { success: true, message: 'Invitation sent successfully.' }
  } catch (error) {
    console.error("inviteUser error:", error); // Log for debugging purposes
    
    // Extract a meaningful error message with specific feedback
    let errorMessage = "Failed to invite user.";
    let errorCode = "UNKNOWN_ERROR";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
      
      // Add specific error codes for better handling on the frontend
      if (errorMessage.includes("already exists")) {
        errorCode = "USER_EXISTS";
      } else if (errorMessage.includes("active invitation already exists")) {
        errorCode = "INVITATION_EXISTS";
      } else if (errorMessage.includes("Invalid email")) {
        errorCode = "INVALID_EMAIL";
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Create an enhanced error object
    const enhancedError = new Error(errorMessage);
    enhancedError.code = errorCode;
    
    throw enhancedError;
  }
};

/**
 * Cancel a pending invitation
 * @param {string} email - Email address of the pending invitation to cancel
 * @returns {Object} - Response data from the cancel invitation API
 */
export const cancelInvitation = async (email) => {
  try {
    const response = await axiosInstance.delete(`/users/admin/users/invite/${email}`);
    return response.data; // Expected to return { success: true, message: 'Invitation canceled successfully.' }
  } catch (error) {
    console.error("cancelInvitation error:", error);
    
    let errorMessage = "Failed to cancel invitation.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Signup a user via invitation token
 * @param {string} token - Invitation token
 * @param {string} name - Name of the user
 * @param {string} password - User's password
 * @param {string} confirmPassword - Confirmation of the password
 * @returns {Object} - Response data from the signup API
 */
export const signupViaInvite = async (
  token,
  name,
  password,
  confirmPassword
) => {
  try {
    const response = await axiosInstance.post("/users/signup", {
      token,
      name,
      password,
      confirmPassword,
    });
    return response.data; // Expected to return user data and token
  } catch (error) {
    throw error.response?.data?.message || "Failed to sign up.";
  }
};

/**
 * Get metrics for a specific user
 * @param {String} id - User ID
 * @returns {Object} - Metrics data
 */
export const getUserMetrics = async (id) => {
  try {
    console.log(`Fetching metrics for user ${id}...`);
    const response = await axiosInstance.get(`/users/admin/users/${id}/metrics`);
    console.log('Raw getUserMetrics response:', response.data);
    
    // Check if response has the expected structure with success flag
    if (response.data && response.data.success) {
      return response.data; // Return the full response including success flag
    } else if (response.data && response.data.metrics) {
      // If we have metrics but no success flag, add it
      return { 
        success: true, 
        metrics: response.data.metrics 
      };
    } else if (response.data) {
      // The response itself might be the metrics
      return { 
        success: true, 
        metrics: response.data 
      };
    } else {
      console.warn("Unexpected empty response from getUserMetrics");
      return { 
        success: false, 
        message: "No metrics data received from server",
        metrics: {
          shopping: {},
          engagement: {},
          recency: {},
          interaction: {}
        }
      };
    }
  } catch (error) {
    console.error("Error in getUserMetrics:", error);
    // Try to extract more info from the error
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch user metrics.",
      metrics: {
        shopping: {},
        engagement: {},
        recency: {},
        interaction: {},
        _status: {
          error: true,
          message: error.response?.data?.message || "Error fetching metrics"
        }
      }
    };
  }
};

/**
 * Get count of new users
 * @returns {Number} - Count of new users
 */
export const getNewUsersCount = async (days = 30) => {
  try {
    console.log('Fetching new users count...');
    const response = await axiosInstance.get("/users/admin/users/count-new", {
      params: { days },
    });
    console.log('Raw getNewUsersCount response:', response.data);
    
    // Check if response has the expected structure
    if (response.data && response.data.success && typeof response.data.count === 'number') {
      return response.data.count;
    }
    // Handle other formats that might exist
    else if (response.data && typeof response.data.newUsers === 'number') {
      return response.data.newUsers;
    }
    else if (response.data && typeof response.data === 'number') {
      return response.data;
    }
    else {
      console.warn("Unexpected response format from getNewUsersCount:", response.data);
      return 0; // Return a safe fallback
    }
  } catch (error) {
    console.error("Failed to fetch new users count:", error);
    // Try to extract more info from the error
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    return 0; // Return a safe fallback instead of throwing
  }
};

/**
 * Get count of returning users
 * @returns {Number} - Count of returning users
 */
export const getReturningUsersCount = async () => {
  try {
    console.log('Fetching returning users count...');
    const response = await axiosInstance.get(
      "/users/admin/users/count-returning"
    );
    console.log('Raw getReturningUsersCount response:', response.data);
    
    // Check if response has the expected structure
    if (response.data && response.data.success && typeof response.data.count === 'number') {
      return response.data.count;
    }
    // Handle other formats that might exist
    else if (response.data && typeof response.data.returningUsers === 'number') {
      return response.data.returningUsers;
    }
    else if (response.data && typeof response.data === 'number') {
      return response.data;
    }
    else {
      console.warn("Unexpected response format from getReturningUsersCount:", response.data);
      return 0; // Return a safe fallback
    }
  } catch (error) {
    console.error("Failed to fetch returning users count:", error);
    // Try to extract more info from the error
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    return 0; // Return a safe fallback instead of throwing
  }
};

/**
 * Get counts of users by active status
 * @returns {Object} - Object containing active and inactive user counts
 */
export const getUserCountsByStatus = async () => {
  try {
    console.log('Fetching user counts by status...');
    const response = await axiosInstance.get(
      "/users/admin/users/count-by-status"
    );
    console.log('Raw getUserCountsByStatus response:', response.data);
    
    // Check if response has the expected structure
    if (response.data && response.data.success && 
        typeof response.data.activeUsers === 'number' && 
        typeof response.data.inactiveUsers === 'number') {
      return {
        activeUsers: response.data.activeUsers,
        inactiveUsers: response.data.inactiveUsers
      };
    } else {
      console.warn("Unexpected response format from getUserCountsByStatus:", response.data);
      return { activeUsers: 0, inactiveUsers: 0 }; // Return a safe fallback
    }
  } catch (error) {
    console.error("Failed to get user counts by status:", error);
    // Try to extract more info from the error
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    return { activeUsers: 0, inactiveUsers: 0 }; // Return a safe fallback
  }
};

// Export all functions as default for easy import
export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  searchUsers,
  exportUsers,
  changeUserStatus,
  bulkUpdateUsers,
  getUserActivity,
  countUsersByRole,
  getUserCount,
  getUserAuditLogs,
  inviteUser,
  signupViaInvite,
  getUserMetrics,
  getNewUsersCount,
  getReturningUsersCount,
  getUserCountsByStatus,
  cancelInvitation,
};
