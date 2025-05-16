// src/hooks/useCoupons.js

import { useContext } from 'react';
import CouponContext from '../contexts/CouponContext';

/**
 * Custom hook to use the CouponContext
 * @returns {Object} - Coupon context value
 */
const useCoupons = () => {
  return useContext(CouponContext);
};

export default useCoupons;
