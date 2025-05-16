// src/api/couponService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance for coupons
const axiosInstance = axios.create({
  baseURL: `${API_URL}/coupons`,
});

// Include auth token in headers if available
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
 * Create a new coupon
 * @param {Object} couponData - Data for the new coupon
 * @returns {Object} - Created coupon data
 */
export const createCoupon = async (couponData) => {
  try {
    const response = await axiosInstance.post('/', couponData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create coupon.');
  }
};

/**
 * Get all coupons with optional filters
 * @param {Object} params - Query parameters (expired, active, sortField, sortOrder)
 * @returns {Object} - List of coupons and count
 */
export const getAllCoupons = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch coupons.');
  }
};

/**
 * Get a single coupon by ID
 * @param {String} id - Coupon ID
 * @returns {Object} - Coupon details
 */
export const getCouponById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch coupon details.');
  }
};

/**
 * Update a coupon by ID
 * @param {String} id - Coupon ID
 * @param {Object} updateData - Data to update
 * @returns {Object} - Updated coupon data
 */
export const updateCoupon = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update coupon.');
  }
};

/**
 * Delete (permanently remove) a coupon by ID
 * @param {String} id - Coupon ID
 * @returns {Object} - Deletion confirmation
 */
export const deleteCoupon = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete coupon.');
  }
};

/**
 * Deactivate a coupon by ID
 * @param {String} id - Coupon ID
 * @returns {Object} - Deactivation confirmation
 */
export const deactivateCoupon = async (id) => {
  try {
    const response = await axiosInstance.post(`/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to deactivate coupon.');
  }
};

/**
 * Activate a coupon by ID
 * @param {String} id - Coupon ID
 * @returns {Object} - Activation confirmation
 */
export const activateCoupon = async (id) => {
  try {
    const response = await axiosInstance.post(`/${id}/activate`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to activate coupon.');
  }
};

/**
 * Apply a coupon to an order
 * @param {Object} data - { code, orderTotal }
 * @returns {Object} - Discount details
 */
export const applyCoupon = async (data) => {
  try {
    const response = await axiosInstance.post('/apply', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to apply coupon.');
  }
};

export default {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  deactivateCoupon,
  activateCoupon,
  applyCoupon,
};
