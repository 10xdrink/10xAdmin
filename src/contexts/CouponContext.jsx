// src/contexts/CouponContext.jsx

import React, { createContext, useState, useCallback } from 'react';
import couponService from '../api/couponService';
import toast from 'react-hot-toast';

// Create the CouponContext
const CouponContext = createContext();

/**
 * CouponProvider component to wrap around parts of the app that need coupon data
 */
export const CouponProvider = ({ children }) => {
  // State variables
  const [coupons, setCoupons] = useState([]); // List of coupons
  const [totalCoupons, setTotalCoupons] = useState(0); // Total coupons count
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  /**
   * Fetch all coupons with optional filters
   * @param {Object} params - Query parameters (expired, active, sortField, sortOrder)
   * @returns {Object} - List of coupons and count
   */
  const fetchCoupons = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await couponService.getAllCoupons(params);
      setCoupons(data.data);
      setTotalCoupons(data.count);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch coupons.');
      toast.error(err.message || 'Failed to fetch coupons.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new coupon
   * @param {Object} couponData - Data for the new coupon
   * @returns {Object} - Created coupon data
   */
  const createNewCoupon = useCallback(async (couponData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await couponService.createCoupon(couponData);
      setCoupons((prev) => [data.data, ...prev]);
      setTotalCoupons((prev) => prev + 1);
      toast.success(data.message || 'Coupon created successfully.');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to create coupon.');
      toast.error(err.message || 'Failed to create coupon.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a coupon by ID
   * @param {String} id - Coupon ID
   * @returns {Object} - Coupon details
   */
  const getCoupon = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await couponService.getCouponById(id);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch coupon details.');
      toast.error(err.message || 'Failed to fetch coupon details.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a coupon by ID
   * @param {String} id - Coupon ID
   * @param {Object} updateData - Data to update
   * @returns {Object} - Updated coupon data
   */
  const updateExistingCoupon = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await couponService.updateCoupon(id, updateData);
      setCoupons((prev) =>
        prev.map((coupon) => (coupon._id === id ? data.data : coupon))
      );
      toast.success(data.message || 'Coupon updated successfully.');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update coupon.');
      toast.error(err.message || 'Failed to update coupon.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete (permanently remove) a coupon by ID
   * @param {String} id - Coupon ID
   */
  const deleteExistingCoupon = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await couponService.deleteCoupon(id);
      setCoupons((prev) => prev.filter((coupon) => coupon._id !== id));
      setTotalCoupons((prev) => prev - 1);
      toast.success('Coupon deleted successfully.');
    } catch (err) {
      setError(err.message || 'Failed to delete coupon.');
      toast.error(err.message || 'Failed to delete coupon.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deactivate a coupon by ID
   * @param {String} id - Coupon ID
   */
  const deactivateCoupon = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await couponService.deactivateCoupon(id);
      setCoupons((prev) =>
        prev.map((coupon) => (coupon._id === id ? data.data : coupon))
      );
      toast.success(data.message || 'Coupon deactivated successfully.');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to deactivate coupon.');
      toast.error(err.message || 'Failed to deactivate coupon.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Activate a coupon by ID
   * @param {String} id - Coupon ID
   */
  const activateCouponFunc = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await couponService.activateCoupon(id);
      setCoupons((prev) =>
        prev.map((coupon) => (coupon._id === id ? data.data : coupon))
      );
      toast.success(data.message || 'Coupon activated successfully.');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to activate coupon.');
      toast.error(err.message || 'Failed to activate coupon.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Apply a coupon to an order
   * @param {Object} data - { code, orderTotal }
   * @returns {Object} - Discount details
   */
  const applyCouponToOrder = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await couponService.applyCoupon(data);
      toast.success(result.message || 'Coupon applied successfully.');
      return result;
    } catch (err) {
      setError(err.message || 'Failed to apply coupon.');
      toast.error(err.message || 'Failed to apply coupon.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CouponContext.Provider
      value={{
        coupons,
        totalCoupons,
        loading,
        error,
        fetchCoupons,
        createNewCoupon,
        getCoupon,
        updateExistingCoupon,
        deleteExistingCoupon,
        deactivateCoupon,
        activateCoupon: activateCouponFunc,
        applyCouponToOrder,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export default CouponContext;
