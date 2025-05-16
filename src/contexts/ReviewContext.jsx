// src/contexts/ReviewContext.jsx

import React, { createContext, useState, useCallback } from 'react';
import reviewService from '../api/reviewService';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// Create the ReviewContext
const ReviewContext = createContext();

/**
 * ReviewProvider component to wrap around parts of the app that need review data
 */
export const ReviewProvider = ({ children }) => {
  // State variables
  const [reviews, setReviews] = useState([]); // List of reviews
  const [totalReviews, setTotalReviews] = useState(0); // Total reviews count
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  /**
   * Fetch all reviews with optional filters
   * @param {Object} params - Query parameters (product, isApproved, page, limit)
   * @returns {Object} - List of reviews and count
   */
  const fetchReviews = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reviewService.getAllReviews(params);
      setReviews(data.data);
      setTotalReviews(data.total);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch reviews.');
      toast.error(err.message || 'Failed to fetch reviews.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a single review by ID
   * @param {String} id - Review ID
   * @returns {Object} - Review details
   */
  const getReview = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reviewService.getReviewById(id);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch review details.');
      toast.error(err.message || 'Failed to fetch review details.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a review by ID
   * @param {String} id - Review ID
   * @param {Object} updateData - Data to update (isApproved, comment)
   * @returns {Object} - Updated review data
   */
  const updateExistingReview = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reviewService.updateReview(id, updateData);
      setReviews((prev) =>
        prev.map((review) => (review._id === id ? data.data : review))
      );
      toast.success(data.message || 'Review updated successfully.');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update review.');
      toast.error(err.message || 'Failed to update review.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a review by ID
   * @param {String} id - Review ID
   */
  const deleteExistingReview = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await reviewService.deleteReview(id);
      setReviews((prev) => prev.filter((review) => review._id !== id));
      setTotalReviews((prev) => prev - 1);
      toast.success('Review deleted successfully.');
    } catch (err) {
      setError(err.message || 'Failed to delete review.');
      toast.error(err.message || 'Failed to delete review.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        totalReviews,
        loading,
        error,
        fetchReviews,
        getReview,
        updateExistingReview,
        deleteExistingReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

ReviewProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ReviewContext;
