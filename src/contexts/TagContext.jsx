// src/contexts/TagContext.jsx

import React, { createContext, useState, useCallback, useEffect } from 'react';
import tagService from '../api/tagService';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// Create the TagContext
const TagContext = createContext();

/**
 * TagProvider component to wrap around parts of the app that need tag data
 */
export const TagProvider = ({ children }) => {
  // State variables
  const [tags, setTags] = useState([]); // List of tags
  const [totalTags, setTotalTags] = useState(0); // Total tags count
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  /**
   * Fetch all tags with optional filters
   * @param {Object} params - Query parameters (page, limit, search, isActive, sortField, sortOrder)
   * @returns {Promise<Object>} - Response data
   */
  const fetchTags = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tagService.getAllTags(params);
      setTags(data.data);
      setTotalTags(data.count);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch tags.');
      toast.error(err.message || 'Failed to fetch tags.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tags on mount
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  /**
   * Create a new tag
   * @param {Object} tagData - Data for the new tag
   * @returns {Promise<Object>} - Created tag data
   */
  const createNewTag = useCallback(async (tagData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tagService.createTag(tagData);
      setTags((prev) => [data.data, ...prev]);
      setTotalTags((prev) => prev + 1);
      toast.success(data.message || 'Tag created successfully.');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to create tag.');
      toast.error(err.message || 'Failed to create tag.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a tag by ID
   * @param {String} id - Tag ID
   * @returns {Promise<Object>} - Tag details
   */
  const getTag = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tagService.getTagById(id);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch tag details.');
      toast.error(err.message || 'Failed to fetch tag details.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a tag by ID
   * @param {String} id - Tag ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated tag data
   */
  const updateExistingTag = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tagService.updateTag(id, updateData);
      setTags((prev) =>
        prev.map((tag) => (tag._id === id ? data.data : tag))
      );
      toast.success(data.message || 'Tag updated successfully.');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update tag.');
      toast.error(err.message || 'Failed to update tag.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Soft delete (deactivate) a tag by ID
   * @param {String} id - Tag ID
   */
  const deleteExistingTag = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await tagService.deleteTag(id);
      // Update the tag's isActive status instead of removing it
      setTags((prev) =>
        prev.map((tag) =>
          tag._id === id ? { ...tag, isActive: false } : tag
        )
      );
      toast.success('Tag deactivated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to deactivate tag.');
      toast.error(err.message || 'Failed to deactivate tag.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Permanently delete a tag by ID
   * @param {String} id - Tag ID
   */
  const permanentDeleteExistingTag = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await tagService.permanentDeleteTag(id);
      setTags((prev) => prev.filter((tag) => tag._id !== id));
      setTotalTags((prev) => prev - 1);
      toast.success('Tag permanently deleted successfully.');
    } catch (err) {
      setError(err.message || 'Failed to permanently delete tag.');
      toast.error(err.message || 'Failed to permanently delete tag.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Activate a tag by ID
   * @param {String} id - Tag ID
   */
  const activateTagFunc = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tagService.activateTag(id);
      setTags((prev) =>
        prev.map((tag) => (tag._id === id ? data.data : tag))
      );
      toast.success(data.message || 'Tag activated successfully.');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to activate tag.');
      toast.error(err.message || 'Failed to activate tag.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TagContext.Provider
      value={{
        tags,
        totalTags,
        loading,
        error,
        fetchTags,
        createNewTag,
        getTag,
        updateExistingTag,
        deleteExistingTag,
        activateTag: activateTagFunc,
        permanentDeleteExistingTag, // Added
      }}
    >
      {children}
    </TagContext.Provider>
  );
};

TagProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TagContext;
