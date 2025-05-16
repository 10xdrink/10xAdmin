// src/hooks/useCategories.js

import { useContext } from 'react';
import CategoryContext from '../contexts/CategoryContext';

/**
 * Custom hook to use the CategoryContext
 * @returns {Object} - Category context value
 */
const useCategories = () => {
  return useContext(CategoryContext);
};

export default useCategories; // Ensure default export
