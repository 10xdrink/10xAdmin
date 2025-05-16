// src/components/Common/Pagination.jsx

import React from 'react';
import { motion } from 'framer-motion';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate an array of page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 5) {
      // If we have 5 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Calculate start and end of current window
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust window to always show 3 pages
      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis before window if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add window pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis after window if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const buttonVariants = {
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.95 }
  };

  const renderPageButton = (page, index) => {
    // If it's an ellipsis, render that
    if (page === '...') {
      return (
        <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-gray-500">
          ...
        </span>
      );
    }

    // Otherwise render a button
    const isCurrentPage = page === currentPage;
    
    return (
      <motion.button
        key={page}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => onPageChange(page)}
        className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all duration-300 ${
          isCurrentPage 
            ? 'bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white shadow-lg' 
            : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
        }`}
      >
        {page}
      </motion.button>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center bg-white rounded-xl p-1 shadow-xl"
    >
      {/* Previous Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center px-4 h-10 rounded-lg mx-1 transition-all duration-300 ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white shadow-md hover:shadow-lg'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </motion.button>

      {/* Page Numbers */}
      <div className="flex space-x-2 mx-2">
        {getPageNumbers().map((page, index) => renderPageButton(page, index))}
      </div>

      {/* Next Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center px-4 h-10 rounded-lg mx-1 transition-all duration-300 ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white shadow-md hover:shadow-lg'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default Pagination;
