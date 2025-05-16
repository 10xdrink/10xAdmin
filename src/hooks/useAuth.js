// src/hooks/useAuth.js

import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

/**
 * Custom hook to access authentication context.
 * @returns {object} Authentication context value.
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
