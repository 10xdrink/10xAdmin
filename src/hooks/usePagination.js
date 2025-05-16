// src/hooks/usePagination.js

import { useState } from 'react';

/**
 * Custom hook to manage pagination state and actions.
 * @param {number} totalPages - Total number of pages available.
 * @param {number} initialPage - Initial page number (default is 1).
 * @returns {object} Pagination state and handler functions.
 */
const usePagination = (totalPages, initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  /**
   * Navigate to a specific page.
   * @param {number} page - Page number to navigate to.
   */
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  /**
   * Navigate to the next page.
   */
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  /**
   * Navigate to the previous page.
   */
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return {
    currentPage,
    setCurrentPage,
    goToPage,
    nextPage,
    prevPage,
    totalPages,
  };
};

export default usePagination;
