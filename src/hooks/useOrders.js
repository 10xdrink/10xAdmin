// src/hooks/useOrders.js

import { useContext } from 'react';
import OrderContext from '../contexts/OrderContext';

const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export default useOrders;
