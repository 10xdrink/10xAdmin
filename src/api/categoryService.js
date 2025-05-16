// src/api/categoryService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance with the base URL for categories
const axiosInstance = axios.create({
  baseURL: `${API_URL}/categories`,
});

// Include auth token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Create a new category
 * @param {Object} categoryData - Data for the new category
 * @returns {Object} - Created category data
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post('/', categoryData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create category.');
  }
};

/**
 * Get all categories with optional query parameters
 * @param {Object} params - Query parameters (e.g., page, limit, search, type, exclude)
 * @returns {Object} - List of categories and pagination info
 */
export const getCategories = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch categories.');
  }
};

/**
 * Get a single category by ID
 * @param {String} id - Category ID
 * @returns {Object} - Category details
 */
export const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch category details.');
  }
};

/**
 * Update an existing category
 * @param {String} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Object} - Updated category data
 */
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update category.');
  }
};

/**
 * Delete a category
 * @param {String} id - Category ID
 * @returns {Object} - Deletion confirmation
 */
export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete category.');
  }
};

export default {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
