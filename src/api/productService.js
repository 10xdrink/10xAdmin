// src/api/productService.js

import axios from 'axios';

// Base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'https://backend.10xdrink.com/api';

// Create an Axios instance for products
const axiosInstance = axios.create({
  baseURL: `${API_URL}/products`,
});

// Include auth token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken'); // Ensure the token key matches
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Get all products with optional filters
 * @param {Object} params - Query parameters (page, limit, category, tags, search)
 * @returns {Object} - List of products, total count, and total pages
 */
export const getAllProducts = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products.');
  }
};

/**
 * Search products by query string
 * @param {String} query - Search query
 * @returns {Object} - List of matching products
 */
export const searchProducts = async (query) => {
  try {
    const response = await axiosInstance.get('/search', { params: { query } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search products.');
  }
};

/**
 * Get a single product by ID
 * @param {String} id - Product ID
 * @returns {Object} - Product details
 */
export const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product details.');
  }
};

/**
 * Get a single product by slug
 * @param {String} slug - Product slug
 * @returns {Object} - Product details
 */
export const getProductBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product details.');
  }
};

/**
 * Create a new product
 * @param {Object} productData - Data for the new product
 * @returns {Object} - Created product data
 */
export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post('/', productData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create product.');
  }
};

/**
 * Update an existing product
 * @param {String} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Object} - Updated product data
 */
export const updateProduct = async (id, productData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, productData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update product.');
  }
};

/**
 * Delete (deactivate) a product by ID
 * @param {String} id - Product ID
 * @returns {Object} - Deactivation confirmation
 */
export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to deactivate product.');
  }
};

/**
 * Update product stock
 * @param {String} id - Product ID
 * @param {Number} stock - New stock value
 * @returns {Object} - Updated product data
 */
export const updateProductStock = async (id, stock) => {
  try {
    const response = await axiosInstance.patch(`/${id}/stock`, { stock });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update product stock.');
  }
};

/**
 * Bulk update products
 * @param {Array} updates - Array of product updates
 * @returns {Object} - Bulk update confirmation
 */
export const bulkUpdateProducts = async (updates) => {
  try {
    const response = await axiosInstance.patch('/bulk-update', { updates });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to bulk update products.');
  }
};

/**
 * Upload product image
 * @param {File} imageFile - Image file to upload
 * @returns {Object} - Uploaded image data
 */
export const uploadProductImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await axiosInstance.post('/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload image.');
  }
};

export default {
  getAllProducts,
  searchProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  bulkUpdateProducts,
  uploadProductImage,
};
