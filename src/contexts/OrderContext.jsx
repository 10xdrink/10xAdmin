// src/contexts/OrderContext.jsx

import React, { createContext, useState, useCallback, useContext } from 'react';
import orderService from '../api/orderService'; // Ensure correct path
import toast from 'react-hot-toast';
import AuthContext from './AuthContext'; // Ensure correct path

const OrderContext = createContext();

/**
 * OrderProvider component to wrap around parts of the app that need order data.
 */
export const OrderProvider = ({ children }) => {
  const { token, logout } = useContext(AuthContext); // Get token and logout from AuthContext
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all orders with optional filters.
   * @param {Object} params - Query parameters.
   */
  const fetchAllOrders = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAllOrders(params, token);
      console.log('Fetched Orders Data:', data); // Debugging line

      // Assuming the API returns { success: true, count: 10, total: 21, data: Array(10), message: 'Orders fetched successfully.' }
      if (data.data && Array.isArray(data.data)) {
        setOrders(data.data);
        setTotalOrders(data.total);
      } else {
        throw new Error('Unexpected API response structure.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch orders.');
      toast.error(err.message || 'Failed to fetch orders.');
      if (err.message === 'Invalid token' || err.message === 'Token expired') {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  /**
   * Fetch authenticated user's orders with optional filters.
   * @param {Object} params - Query parameters.
   */
  const fetchMyOrders = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getMyOrders(params, token);
      console.log('Fetched My Orders Data:', data); // Debugging line

      if (data.data && Array.isArray(data.data)) {
        setOrders(data.data);
        setTotalOrders(data.total);
      } else {
        throw new Error('Unexpected API response structure.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch your orders.');
      toast.error(err.message || 'Failed to fetch your orders.');
      if (err.message === 'Invalid token' || err.message === 'Token expired') {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  /**
   * Fetch a single order by ID.
   * @param {String} id - Order ID.
   */
  const fetchOrderById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrderById(id, token);
      console.log(`Fetched Order Data for ID ${id}:`, data); // Debugging line

      if (data.data) {
        return data.data; // Return the actual order data
      } else {
        throw new Error('Unexpected API response structure.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch the order.');
      toast.error(err.message || 'Failed to fetch the order.');
      if (err.message === 'Invalid token' || err.message === 'Token expired') {
        logout();
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  /**
   * Update order status.
   * @param {String} id - Order ID.
   * @param {String} status - New status.
   */
  const changeOrderStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.updateOrderStatus(id, status, token);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: data.status } : order
        )
      );
      toast.success(data.message || 'Order status updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update order status.');
      toast.error(err.message || 'Failed to update order status.');
      if (err.message === 'Invalid token' || err.message === 'Token expired') {
        logout();
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  /**
   * Cancel an order.
   * @param {String} id - Order ID.
   * @param {String} reason - Cancellation reason.
   */
  const cancelOrderById = useCallback(async (id, reason) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.cancelOrder(id, reason, token);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: 'cancelled', cancellationReason: reason } : order
        )
      );
      toast.success(data.message || 'Order cancelled successfully.');
    } catch (err) {
      setError(err.message || 'Failed to cancel the order.');
      toast.error(err.message || 'Failed to cancel the order.');
      if (err.message === 'Invalid token' || err.message === 'Token expired') {
        logout();
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  /**
   * Bulk update orders' statuses.
   * @param {Array} orderIds - Array of Order IDs to update.
   * @param {String} status - New status to set for all specified orders.
   */
  const bulkUpdateOrders = useCallback(async (orderIds, status) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.bulkUpdateOrders(orderIds, status, token);
      console.log('Bulk Update Response:', data); // Debugging line

      // Assuming the API does not return updated orders, we'll manually update the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          orderIds.includes(order._id) ? { ...order, status: status } : order
        )
      );
      toast.success(data.message || 'Bulk update successful.');
    } catch (err) {
      setError(err.message || 'Failed to bulk update orders.');
      toast.error(err.message || 'Failed to bulk update orders.');
      if (err.message === 'Invalid token' || err.message === 'Token expired') {
        logout();
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  /**
   * Update tracking details for an order.
   * @param {String} id - Order ID.
   * @param {Object} trackingDetails - Tracking details object.
   */
  const updateTracking = useCallback(async (id, trackingDetails) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.updateTracking(id, trackingDetails, token);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, trackingDetails: trackingDetails } : order
        )
      );
      toast.success(data.message || 'Tracking details updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update tracking details.');
      toast.error(err.message || 'Failed to update tracking details.');
      if (err.message === 'Invalid token' || err.message === 'Token expired') {
        logout();
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  /**
   * Process a refund for an order.
   * @param {String} id - Order ID.
   * @param {Number} amount - Refund amount.
   * @param {String} reason - Refund reason.
   */
  const processRefund = useCallback(async (id, amount, reason) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.processRefund(id, amount, reason, token);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id
            ? { ...order, refundedAmount: (order.refundedAmount || 0) + amount }
            : order
        )
      );
      toast.success(data.message || 'Refund processed successfully.');
    } catch (err) {
      setError(err.message || 'Failed to process refund.');
      toast.error(err.message || 'Failed to process refund.');
      if (err.message === 'Invalid token' || err.message === 'Token expired') {
        logout();
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  /**
   * Request a return for an order.
   * @param {String} id - Order ID.
   * @param {Array} items - Items to return.
   * @param {String} reason - Return reason.
   */
  const requestReturn = useCallback(async (id, items, reason) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.requestReturn(id, items, reason, token);
      // Optionally, update the order state based on the response
      toast.success(data.message || 'Return request submitted successfully.');
    } catch (err) {
      setError(err.message || 'Failed to submit return request.');
      toast.error(err.message || 'Failed to submit return request.');
      if (err.message === 'Invalid token' || err.message === 'Token expired') {
        logout();
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        totalOrders,
        loading,
        error,
        fetchAllOrders,
        fetchMyOrders,
        fetchOrderById,
        changeOrderStatus,
        cancelOrderById,
        bulkUpdateOrders,
        updateTracking,    // Added
        processRefund,     // Added
        requestReturn,     // Added
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
