// src/contexts/CategoryContext.jsx

import React, { createContext, useState, useCallback, useEffect } from 'react';
import categoryService from '../api/categoryService';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// Create the CategoryContext
const CategoryContext = createContext();

/**
 * CategoryProvider component to wrap around parts of the app that need category data
 */
export const CategoryProvider = ({ children }) => {
  // State variables
  const [categories, setCategories] = useState([]); // List of categories
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  /**
   * Fetch categories with optional parameters for pagination, search, and filtering
   * @param {Object} params - Query parameters (page, limit, search, type, sortField, sortOrder, exclude)
   * @returns {Object} - Contains fetched data
   */
  const fetchCategories = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories(params);
      setCategories(data.data);
      setTotalPages(data.totalPages || 1);
      console.log('Fetched Categories:', data.data);
      console.log('Total Pages:', data.totalPages);
      return data; // Return full data for further use if needed
    } catch (err) {
      console.error('fetchCategories error:', err);
      setError(err.message || 'Failed to fetch categories.');
      toast.error(err.message || 'Failed to fetch categories.');
      throw err; // Re-throw to allow catching in the page
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /**
   * Get a single category by ID
   * @param {String} id - Category ID
   * @returns {Object|null} - Category details or null if not found
   */
  const getCategoryById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategoryById(id);
      return data; // data is the category object
    } catch (err) {
      console.error('getCategoryById error:', err);
      setError(err.message || 'Failed to fetch category details.');
      toast.error(err.message || 'Failed to fetch category details.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new category
   * @param {Object} categoryData - Data for the new category
   * @returns {Object} - Created category data
   */
  const createCategory = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.createCategory(categoryData);
      setCategories((prev) => [data.data, ...prev]);
      toast.success(data.message || 'Category created successfully.');
      return data;
    } catch (err) {
      console.error('createCategory error:', err);
      setError(err.message || 'Failed to create category.');
      toast.error(err.message || 'Failed to create category.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing category
   * @param {String} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Object} - Updated category data
   */
  const updateCategory = useCallback(async (id, categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.updateCategory(id, categoryData);
      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? data.data : cat))
      );
      toast.success(data.message || 'Category updated successfully.');
      return data;
    } catch (err) {
      console.error('updateCategory error:', err);
      setError(err.message || 'Failed to update category.');
      toast.error(err.message || 'Failed to update category.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a category
   * @param {String} id - Category ID
   */
  const deleteCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await categoryService.deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      toast.success('Category deleted successfully.');
    } catch (err) {
      console.error('deleteCategory error:', err);
      setError(err.message || 'Failed to delete category.');
      toast.error(err.message || 'Failed to delete category.');
      throw err; // To allow catching in the caller
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        totalPages,
        loading,
        error,
        fetchCategories,
        getCategoryById,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

CategoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CategoryContext;
