// src/hooks/useTags.js

import { useContext } from 'react';
import TagContext from '../contexts/TagContext';

/**
 * Custom hook to use TagContext
 * @returns {Object} - Tag context values and functions
 */
const useTags = () => {
  return useContext(TagContext);
};

export default useTags;
