// src/api/tagService.js

import axios from 'axios';

// Base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an Axios instance for tags
const axiosInstance = axios.create({
  baseURL: `${API_URL}/tags`,
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
 * Permanently delete a tag by ID
 * @param {String} id - Tag ID
 * @returns {Object} - Deletion confirmation
 */
export const permanentDeleteTag = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}/permanent`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to permanently delete tag.');
  }
};

/**
 * Create a new tag
 * @param {Object} tagData - Data for the new tag
 * @returns {Object} - Created tag data
 */
export const createTag = async (tagData) => {
  try {
    const response = await axiosInstance.post('/', tagData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create tag.');
  }
};

/**
 * Get all tags with optional filters
 * @param {Object} params - Query parameters (page, limit, search, isActive, sortField, sortOrder)
 * @returns {Object} - List of tags and count
 */
export const getAllTags = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tags.');
  }
};

/**
 * Get a single tag by ID
 * @param {String} id - Tag ID
 * @returns {Object} - Tag details
 */
export const getTagById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tag details.');
  }
};

/**
 * Update a tag by ID
 * @param {String} id - Tag ID
 * @param {Object} updateData - Data to update
 * @returns {Object} - Updated tag data
 */
export const updateTag = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update tag.');
  }
};

/**
 * Soft delete (deactivate) a tag by ID
 * @param {String} id - Tag ID
 * @returns {Object} - Deactivation confirmation
 */
export const deleteTag = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to deactivate tag.');
  }
};

/**
 * Activate a tag by ID
 * @param {String} id - Tag ID
 * @returns {Object} - Activation confirmation
 */
export const activateTag = async (id) => {
  try {
    const response = await axiosInstance.post(`/${id}/activate`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to activate tag.');
  }
};

export default {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
  activateTag,
  permanentDeleteTag, // Added

};
