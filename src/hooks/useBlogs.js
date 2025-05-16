// src/hooks/useBlogs.js

import { useContext } from 'react';
import BlogContext from '../contexts/BlogContext';

/**
 * Custom hook to access the BlogContext.
 * @returns {Object} - The blog context value.
 */
const useBlogs = () => {
  return useContext(BlogContext);
};

export default useBlogs;
