// src/hooks/useReviews.js

import { useContext } from 'react';
import ReviewContext from '../contexts/ReviewContext';

/**
 * Custom hook to use ReviewContext
 * @returns {Object} - Review context values
 */
const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};

export default useReviews;
