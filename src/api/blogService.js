// src/services/blogService.js

import axios from 'axios';

// Base API URL (thanks to Vite's proxy, '/api' will be proxied to 'http://localhost:5000/api')
const API_URL = '/api/blogs';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add the token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken'); // Ensure the token is stored as 'adminToken'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Fetch all blog posts with optional filters.
 * @param {Object} params - Query parameters for filtering, pagination, sorting.
 * @returns {Promise<Object>} - Response data.
 */
const getAllBlogs = async (params) => {
  const response = await axiosInstance.get('/', { params });
  return response.data;
};

/**
 * Get a single blog post by ID.
 * @param {String} id - Blog post ID.
 * @returns {Promise<Object>} - Response data.
 */
const getBlogById = async (id) => {
  const response = await axiosInstance.get(`/${id}`);
  return response.data;
};

/**
 * Create a new blog post.
 * @param {Object} blogData - Data for the new blog post.
 * @returns {Promise<Object>} - Response data.
 */
const createBlog = async (blogData) => {
  const response = await axiosInstance.post('/', blogData);
  return response.data;
};

/**
 * Update an existing blog post.
 * @param {String} id - Blog post ID.
 * @param {Object} blogData - Updated data.
 * @returns {Promise<Object>} - Response data.
 */
const updateBlog = async (id, blogData) => {
  const response = await axiosInstance.put(`/${id}`, blogData);
  return response.data;
};

/**
 * Delete a blog post.
 * @param {String} id - Blog post ID.
 * @returns {Promise<Object>} - Response data.
 */
const deleteBlog = async (id) => {
  const response = await axiosInstance.delete(`/${id}`);
  return response.data;
};

/**
 * Upload an image for a blog post.
 * @param {File} file - Image file to upload.
 * @returns {Promise<Object>} - Response data containing image URL.
 */
const uploadBlogImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

const blogService = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
};

export default blogService;
