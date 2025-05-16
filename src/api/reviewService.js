// src/api/reviewService.js

import axios from 'axios';

// Define the API URL directly to avoid 'process is not defined' error
const API_URL = 'http://localhost:5000/api'; // Replace with your actual API URL

// Create an Axios instance for reviews
const axiosInstance = axios.create({
  baseURL: `${API_URL}/reviews`,
});

// Include auth token in headers if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken'); // Adjust based on how you store the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Create a new review
 * @param {Object} reviewData - Data for the new review
 * @returns {Object} - Created review data
 */
export const createReview = async (reviewData) => {
  try {
    const response = await axiosInstance.post('/', reviewData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create review.');
  }
};

/**
 * Get all reviews with optional filters
 * @param {Object} params - Query parameters (product, isApproved, page, limit)
 * @returns {Object} - List of reviews and count
 */
export const getAllReviews = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews.');
  }
};

/**
 * Get a single review by ID
 * @param {String} id - Review ID
 * @returns {Object} - Review details
 */
export const getReviewById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch review details.');
  }
};

/**
 * Update a review by ID
 * @param {String} id - Review ID
 * @param {Object} updateData - Data to update (isApproved, comment)
 * @returns {Object} - Updated review data
 */
export const updateReview = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update review.');
  }
};

/**
 * Delete a review by ID
 * @param {String} id - Review ID
 * @returns {Object} - Deletion confirmation
 */
export const deleteReview = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete review.');
  }
};

export default {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
