// src/api/settingsService.js

import axios from "axios";

// Base URL from environment variables or default to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create an axios instance for settings operations
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
 * Fetch all site settings
 * @returns {Object} - Response data containing settings
 */
export const getSettings = async () => {
  try {
    const response = await axiosInstance.get("/settings");
    return response.data.data; // Return the settings object directly
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error.response?.data?.message || "Failed to fetch settings.";
  }
};

/**
 * Update site settings
 * @param {Object} settings - Updated settings
 * @returns {Object} - Response data confirming update
 */
export const updateSettings = async (settings) => {
  try {
    const response = await axiosInstance.put("/settings", settings);
    return response.data; // Expected to return { success: true, data: {...settings} }
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error.response?.data?.message || "Failed to update settings.";
  }
};

// Export as default object for easier imports
const settingsService = {
  getSettings,
  updateSettings,
};

export default settingsService; 