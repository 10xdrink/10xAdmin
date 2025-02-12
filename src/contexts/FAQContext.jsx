// src/contexts/FAQContext.jsx

import React, { createContext, useState, useCallback } from 'react';
import faqService from '../api/faqService'; // Ensure this service exists
import toast from 'react-hot-toast';

// Create the FAQContext
const FAQContext = createContext();

/**
 * FAQProvider component to wrap around parts of the app that need FAQ data
 */
export const FAQProvider = ({ children }) => {
  // State variables
  const [faqs, setFAQs] = useState([]); // List of FAQs
  const [totalFAQs, setTotalFAQs] = useState(0); // Total FAQs count
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  /**
   * Fetch all FAQs with optional filters
   * @param {Object} params - Query parameters (e.g., page, limit, search)
   * @returns {Object} - List of FAQs and count
   */
  const fetchFAQs = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await faqService.getAllFAQs(params);
      setFAQs(data.data);
      setTotalFAQs(data.count);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch FAQs.');
      toast.error(err.message || 'Failed to fetch FAQs.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new FAQ
   * @param {Object} faqData - Data for the new FAQ
   * @returns {Object} - Created FAQ data
   */
  const createNewFAQ = useCallback(async (faqData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await faqService.createFAQ(faqData);
      setFAQs((prev) => [data.data, ...prev]);
      setTotalFAQs((prev) => prev + 1);
      toast.success(data.message || 'FAQ created successfully.');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to create FAQ.');
      toast.error(err.message || 'Failed to create FAQ.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get an FAQ by ID
   * @param {String} id - FAQ ID
   * @returns {Object} - FAQ details
   */
  const getFAQ = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await faqService.getFAQById(id);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch FAQ details.');
      toast.error(err.message || 'Failed to fetch FAQ details.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an FAQ by ID
   * @param {String} id - FAQ ID
   * @param {Object} updateData - Data to update
   * @returns {Object} - Updated FAQ data
   */
  const updateExistingFAQ = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await faqService.updateFAQ(id, updateData);
      setFAQs((prev) =>
        prev.map((faq) => (faq._id === id ? data.data : faq))
      );
      toast.success(data.message || 'FAQ updated successfully.');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update FAQ.');
      toast.error(err.message || 'Failed to update FAQ.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete (deactivate) an FAQ by ID
   * @param {String} id - FAQ ID
   */
  const deleteExistingFAQ = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await faqService.deleteFAQ(id);
      setFAQs((prev) => prev.filter((faq) => faq._id !== id));
      setTotalFAQs((prev) => prev - 1);
      toast.success('FAQ deleted successfully.');
    } catch (err) {
      setError(err.message || 'Failed to delete FAQ.');
      toast.error(err.message || 'Failed to delete FAQ.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <FAQContext.Provider
      value={{
        faqs,
        totalFAQs,
        loading,
        error,
        fetchFAQs,
        createNewFAQ,
        getFAQ,
        updateExistingFAQ,
        deleteExistingFAQ,
      }}
    >
      {children}
    </FAQContext.Provider>
  );
};

export default FAQContext;
