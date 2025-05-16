// src/api/productService.js

import axios from 'axios';

// Update this to use the correct API URL format
const API_URL = '/api/products';

// Create an Axios instance for products with the correct path
const axiosInstance = axios.create({
  baseURL: API_URL, // Remove the duplicate /products in the path
});

// Include auth token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken'); // Ensure the token key matches
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log outgoing requests for debugging
    console.log('Product API Request:', {
      url: config.url,
      method: config.method,
      params: config.params
    });
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Product API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Product API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      errors: error.response?.data?.errors
    });
    return Promise.reject(error);
  }
);

/**
 * Get all products with optional filters
 * @param {Object} params - Query parameters (page, limit, category, tags, search, etc.)
 * @returns {Object} - List of products, total count, and total pages
 */
export const getAllProducts = async (params = {}) => {
  try {
    // Ensure all numeric params are actually numbers
    const sanitizedParams = {};
    
    // Convert string values to proper types
    const numericParams = ['page', 'limit', 'priceMin', 'priceMax', 'stockMin', 'stockMax', 'sortDirection'];
    numericParams.forEach(param => {
      if (params[param] !== undefined && params[param] !== '') {
        sanitizedParams[param] = Number(params[param]);
      }
    });
    
    // Handle boolean parameters
    const booleanParams = ['isActive', 'inStock'];
    booleanParams.forEach(param => {
      if (params[param] !== undefined) {
        // Convert string 'true'/'false' to actual boolean
        if (typeof params[param] === 'string') {
          sanitizedParams[param] = params[param].toLowerCase() === 'true';
        } else {
          sanitizedParams[param] = Boolean(params[param]);
        }
      }
    });
    
    // Handle date parameters
    if (params.dateStart) {
      sanitizedParams.dateStart = new Date(params.dateStart).toISOString();
    }
    
    if (params.dateEnd) {
      sanitizedParams.dateEnd = new Date(params.dateEnd).toISOString();
    }
    
    // Handle array parameters (tags)
    if (params.tags && Array.isArray(params.tags) && params.tags.length > 0) {
      // If tags is an array of objects with value property, extract the values
      if (typeof params.tags[0] === 'object' && params.tags[0].value) {
        sanitizedParams.tags = params.tags.map(tag => tag.value).join(',');
      } else {
        sanitizedParams.tags = params.tags.join(',');
      }
    }
    
    // Copy other parameters as is
    for (const [key, value] of Object.entries(params)) {
      if (!numericParams.includes(key) && !booleanParams.includes(key) && 
          key !== 'dateStart' && key !== 'dateEnd' && key !== 'tags' && 
          value !== undefined && value !== '') {
        sanitizedParams[key] = value;
      }
    }
    
    // Provide defaults for required params to avoid validation errors
    if (!sanitizedParams.page) sanitizedParams.page = 1;
    if (!sanitizedParams.limit) sanitizedParams.limit = 10;
    
    console.log('Fetching products with params:', sanitizedParams);
    const response = await axiosInstance.get('/', { params: sanitizedParams });
    
    // Return the data or a fallback empty array
    return response.data || { success: true, products: [], total: 0, totalPages: 0 };
  } catch (error) {
    console.error('Error in getAllProducts:', error.response?.data || error.message);
    
    // Return a friendly fallback object instead of throwing an error
    return { 
      success: false, 
      products: [], 
      total: 0, 
      totalPages: 0,
      error: error.response?.data?.message || 'Failed to fetch products' 
    };
  }
};

/**
 * Search products by query string
 * @param {String} query - Search query
 * @returns {Object} - List of matching products
 */
export const searchProducts = async (query) => {
  try {
    // Log the search query for debugging
    console.log('Searching products with query:', query);
    
    // Make sure we're using the parameter name expected by the backend
    const response = await axiosInstance.get('/search', { params: { search: query } });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error.response?.data || error.message);
    return { success: false, products: [] };
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
 * @param {Array} updates - Array of product updates { id, fields }
 * @returns {Object} - Bulk update confirmation
 */
export const bulkUpdateProducts = async (updates) => {
  try {
    // Validate the updates format
    if (!Array.isArray(updates)) {
      throw new Error('Updates must be an array');
    }
    
    // Ensure each update has an id and fields
    updates.forEach((update, index) => {
      if (!update.id) {
        throw new Error(`Update at index ${index} is missing an id`);
      }
      if (!update.fields || typeof update.fields !== 'object') {
        throw new Error(`Update at index ${index} is missing fields or fields is not an object`);
      }
    });
    
    const response = await axiosInstance.post('/bulk-update', { updates });
    return response.data;
  } catch (error) {
    console.error('Error in bulkUpdateProducts:', error);
    throw new Error(error.response?.data?.message || 'Failed to bulk update products.');
  }
};

/**
 * Bulk activate products
 * @param {Array} productIds - Array of product IDs to activate
 * @returns {Object} - Bulk update confirmation
 */
export const bulkActivateProducts = async (productIds) => {
  try {
    const updates = productIds.map(id => ({
      id,
      fields: { isActive: true }
    }));
    return await bulkUpdateProducts(updates);
  } catch (error) {
    throw new Error(error.message || 'Failed to activate products.');
  }
};

/**
 * Bulk deactivate products
 * @param {Array} productIds - Array of product IDs to deactivate
 * @returns {Object} - Bulk update confirmation
 */
export const bulkDeactivateProducts = async (productIds) => {
  try {
    const updates = productIds.map(id => ({
      id,
      fields: { isActive: false }
    }));
    return await bulkUpdateProducts(updates);
  } catch (error) {
    throw new Error(error.message || 'Failed to deactivate products.');
  }
};

/**
 * Bulk update product stock
 * @param {Array} productIds - Array of product IDs to update
 * @param {Number} stockValue - New stock value
 * @returns {Object} - Bulk update confirmation
 */
export const bulkUpdateStock = async (productIds, stockValue) => {
  try {
    const updates = productIds.map(id => ({
      id,
      fields: { stock: stockValue }
    }));
    return await bulkUpdateProducts(updates);
  } catch (error) {
    throw new Error(error.message || 'Failed to update product stock.');
  }
};

/**
 * Bulk update product price
 * @param {Array} productIds - Array of product IDs to update
 * @param {Number} priceValue - New price value
 * @returns {Object} - Bulk update confirmation
 */
export const bulkUpdatePrice = async (productIds, priceValue) => {
  try {
    const updates = productIds.map(id => ({
      id,
      fields: { price: priceValue }
    }));
    return await bulkUpdateProducts(updates);
  } catch (error) {
    throw new Error(error.message || 'Failed to update product price.');
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
  bulkActivateProducts,
  bulkDeactivateProducts,
  bulkUpdateStock,
  bulkUpdatePrice,
  uploadProductImage,
};
