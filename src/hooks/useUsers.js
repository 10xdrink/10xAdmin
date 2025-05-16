// src/hooks/useUsers.js

import { useContext } from 'react';
import UserContext from '../contexts/UserContext';

/**
 * Custom hook to access user context.
 * @returns {object} User context value.
 */
const useUsers = () => {
  return useContext(UserContext);
};

export default useUsers;
