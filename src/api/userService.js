// src/api/userService.js

import axios from "axios";

// Base URL from environment variables or default to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://3.110.92.192:5000/api";

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
 * Update an existing user's details
 * @param {String} id - User ID
 * @param {FormData} userData - FormData object containing updated user details and optional profile picture
 * @returns {Object} - Response data containing updated user details
 */
export const updateUser = async (id, userData) => {
  try {
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
 * @returns {Object} - Response data containing counts per role
 */
export const countUsersByRole = async () => {
  try {
    const response = await axiosInstance.get(
      "/users/admin/users/count-by-role"
    );
    return response.data; // Expected to return { success: true, counts: [{ role: 'admin', count: 5 }, ...] }
  } catch (error) {
    throw error.response?.data?.message || "Failed to count users by role.";
  }
};

/**
 * Get total number of users
 * @returns {Number} - Total user count
 */
export const getUserCount = async () => {
  try {
    const response = await axiosInstance.get("/users/admin/users/count");
    return response.data.totalUsers; // Correct field name
  } catch (error) {
    throw error.response?.data?.message || "Failed to get total user count.";
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
 * Invite a new user by sending an invitation email
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
    const errorMessage =
      error.response?.data?.message || "Failed to invite user.";
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
    const response = await axiosInstance.get(`/users/admin/users/${id}/metrics`);
    return response.data.metrics; // Expected to return { metrics: { productPurchasedCount, loginFrequency, ... } }
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch user metrics.";
  }
};

/**
 * Get count of new users
 * @param {Number} [days=30] - Number of days to consider for new users
 * @returns {Number} - Count of new users
 */
export const getNewUsersCount = async (days = 30) => {
  try {
    const response = await axiosInstance.get("/users/admin/users/count-new", {
      params: { days },
    });
    return response.data.newUsers; // Correct field name
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch new users count.";
  }
};

/**
 * Get count of returning users
 * @returns {Number} - Count of returning users
 */
export const getReturningUsersCount = async () => {
  try {
    const response = await axiosInstance.get(
      "/users/admin/users/count-returning"
    );
    return response.data.returningUsers; // Correct field name
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch returning users count.";
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
  getUserMetrics, // Ensure this is exported
  getNewUsersCount,
  getReturningUsersCount,
};
