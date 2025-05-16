// src/api/faqService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance for FAQs
const axiosInstance = axios.create({
  baseURL: `${API_URL}/faqs`,
});

// Include auth token in headers if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken'); // Adjust based on your auth implementation
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Create a new FAQ
 * @param {Object} faqData - Data for the new FAQ
 * @returns {Object} - Created FAQ data
 */
export const createFAQ = async (faqData) => {
  try {
    const response = await axiosInstance.post('/', faqData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create FAQ.');
  }
};

/**
 * Get all FAQs with optional filters
 * @param {Object} params - Query parameters (e.g., page, limit, search)
 * @returns {Object} - List of FAQs and count
 */
export const getAllFAQs = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch FAQs.');
  }
};

/**
 * Get a single FAQ by ID
 * @param {String} id - FAQ ID
 * @returns {Object} - FAQ details
 */
export const getFAQById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch FAQ details.');
  }
};

/**
 * Update a FAQ by ID
 * @param {String} id - FAQ ID
 * @param {Object} updateData - Data to update
 * @returns {Object} - Updated FAQ data
 */
export const updateFAQ = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update FAQ.');
  }
};

/**
 * Delete (deactivate) a FAQ by ID
 * @param {String} id - FAQ ID
 */
export const deleteFAQ = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete FAQ.');
  }
};

export default {
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQ,
  deleteFAQ,
};
