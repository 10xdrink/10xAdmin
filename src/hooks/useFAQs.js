// src/hooks/useFAQs.js

import { useContext } from 'react';
import FAQContext from '../contexts/FAQContext';

/**
 * Custom hook to use the FAQContext
 * @returns {Object} - FAQ context value
 */
const useFAQs = () => {
  const context = useContext(FAQContext);
  if (context === undefined) {
    throw new Error('useFAQs must be used within a FAQProvider');
  }
  return context;
};

export default useFAQs;
