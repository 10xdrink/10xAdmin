// src/services/orderService.js

const ORDERS_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * List of allowed order statuses as per backend definitions.
 * Ensure these match exactly with the backend's allowed statuses.
 */
const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

/**
 * List of allowed carriers.
 * Optionally, you can make this dynamic based on backend data or configuration.
 */
const ALLOWED_CARRIERS = [
  'UPS',
  'FedEx',
  'DHL',
  'USPS',
  // Add more carriers as needed
];

const orderService = {
  /**
   * Helper function to build query string from params, excluding undefined or null values.
   * @param {Object} params
   * @returns {String} - Query string
   */
  buildQueryString: (params) => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
    );
    return new URLSearchParams(filteredParams).toString();
  },

  /**
   * Fetch all orders with optional filters.
   * @param {Object} params - Query parameters for filtering, pagination, sorting.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  getAllOrders: async (params, token) => {
    const query = orderService.buildQueryString(params);
    const url = `${ORDERS_API_URL}/orders${query ? `?${query}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('API Response for getAllOrders:', data); // Added log

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }

    return data;
  },

  /**
   * Fetch order metrics.
   * @param {Object} params - Query parameters for date filtering.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  getOrderMetrics: async (params, token) => {
    const query = orderService.buildQueryString(params);
    const url = `${ORDERS_API_URL}/orders/metrics${query ? `?${query}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('API Response for getOrderMetrics:', data); // Added log

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order metrics');
    }

    return data;
  },

  /**
   * Fetch authenticated user's orders with optional filters.
   * @param {Object} params - Query parameters for filtering, pagination.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  getMyOrders: async (params, token) => {
    const query = orderService.buildQueryString(params);
    const url = `${ORDERS_API_URL}/orders/my-orders${query ? `?${query}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('API Response for getMyOrders:', data); // Added log

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch your orders');
    }

    return data;
  },

  /**
   * Fetch a single order by ID.
   * @param {String} id - Order ID.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  getOrderById: async (id, token) => {
    const response = await fetch(`${ORDERS_API_URL}/orders/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log(`API Response for getOrderById (${id}):`, data); // Added log

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch the order');
    }

    return data;
  },

  /**
   * Update order status.
   * @param {String} id - Order ID.
   * @param {String} status - New status.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  updateOrderStatus: async (id, status, token) => {
    // Ensure that 'status' is a valid string and matches backend expectations
    if (typeof status !== 'string' || status.trim() === '') {
      throw new Error('Invalid status value provided.');
    }

    // Normalize the status to lowercase to match backend expectations
    const normalizedStatus = status.trim().toLowerCase();

    // Validate against allowed statuses
    const validStatuses = Object.values(ORDER_STATUSES);
    if (!validStatuses.includes(normalizedStatus)) {
      throw new Error(`Invalid status value: ${normalizedStatus}. Allowed statuses are: ${validStatuses.join(', ')}`);
    }

    try {
      const response = await fetch(`${ORDERS_API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: normalizedStatus }),
      });

      const data = await response.json();
      console.log(`API Response for updateOrderStatus (${id}):`, data); // Added log

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order status');
      }

      return data;
    } catch (error) {
      // Log the error for debugging
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  /**
   * Cancel an order.
   * @param {String} id - Order ID.
   * @param {String} reason - Cancellation reason.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  cancelOrder: async (id, reason, token) => {
    // Ensure 'reason' is provided and is a non-empty string
    if (typeof reason !== 'string' || reason.trim() === '') {
      throw new Error('Cancellation reason must be provided and cannot be empty.');
    }

    const response = await fetch(`${ORDERS_API_URL}/orders/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ reason: reason.trim() }),
    });

    const data = await response.json();
    console.log(`API Response for cancelOrder (${id}):`, data); // Added log

    if (!response.ok) {
      throw new Error(data.message || 'Failed to cancel the order');
    }

    return data;
  },

  /**
   * Update tracking details for an order.
   * @param {String} id - Order ID.
   * @param {Object} trackingDetails - Object containing trackingId and carrier.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  updateTracking: async (id, trackingDetails, token) => {
    const { trackingId, carrier } = trackingDetails;

    // Validate inputs
    if (!trackingId || typeof trackingId !== 'string' || trackingId.trim() === '') {
      throw new Error('Tracking ID must be a non-empty string.');
    }

    if (!carrier || typeof carrier !== 'string' || carrier.trim() === '') {
      throw new Error('Carrier must be a non-empty string.');
    }

    const normalizedCarrier = carrier.trim();

    // Optionally, validate carrier against a list of allowed carriers
    if (!ALLOWED_CARRIERS.includes(normalizedCarrier)) {
      throw new Error(`Invalid carrier: ${normalizedCarrier}. Allowed carriers are: ${ALLOWED_CARRIERS.join(', ')}`);
    }

    try {
      const response = await fetch(`${ORDERS_API_URL}/orders/${id}/tracking`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          trackingId: trackingId.trim(),
          carrier: normalizedCarrier,
        }),
      });

      const data = await response.json();
      console.log(`API Response for updateTracking (${id}):`, data); // Added log

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update tracking details');
      }

      return data;
    } catch (error) {
      console.error('Error updating tracking details:', error);
      throw error;
    }
  },

  /**
   * Process a refund for an order.
   * @param {String} id - Order ID.
   * @param {Number} amount - Amount to refund.
   * @param {String} reason - Reason for refund.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  processRefund: async (id, amount, reason, token) => {
    // Validate amount
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      throw new Error('Refund amount must be a positive number.');
    }

    // Reason can be optional or required based on backend
    if (typeof reason !== 'string' || reason.trim() === '') {
      throw new Error('Refund reason must be provided and cannot be empty.');
    }

    try {
      const response = await fetch(`${ORDERS_API_URL}/orders/${id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amount,
          reason: reason.trim(),
        }),
      });

      const data = await response.json();
      console.log(`API Response for processRefund (${id}):`, data); // Added log

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process refund');
      }

      return data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  },

  /**
   * Request a return for an order.
   * @param {String} id - Order ID.
   * @param {Array} items - Array of items to return (each with productId and quantity).
   * @param {String} reason - Reason for return.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  requestReturn: async (id, items, reason, token) => {
    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('At least one item must be specified for return.');
    }

    for (const item of items) {
      if (
        !item.productId ||
        typeof item.productId !== 'string' ||
        item.productId.trim() === ''
      ) {
        throw new Error('Each return item must have a valid productId.');
      }
      if (
        typeof item.quantity !== 'number' ||
        isNaN(item.quantity) ||
        item.quantity < 1
      ) {
        throw new Error('Each return item must have a valid quantity of at least 1.');
      }
    }

    // Validate reason
    if (typeof reason !== 'string' || reason.trim() === '') {
      throw new Error('Return reason must be provided and cannot be empty.');
    }

    try {
      const response = await fetch(`${ORDERS_API_URL}/orders/${id}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId.trim(),
            quantity: item.quantity,
          })),
          reason: reason.trim(),
        }),
      });

      const data = await response.json();
      console.log(`API Response for requestReturn (${id}):`, data); // Added log

      if (!response.ok) {
        throw new Error(data.message || 'Failed to request return');
      }

      return data;
    } catch (error) {
      console.error('Error requesting return:', error);
      throw error;
    }
  },

  /**
   * Bulk update orders' statuses.
   * @param {Array} orderIds - Array of Order IDs to update.
   * @param {String} status - New status to set for all specified orders.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  bulkUpdateOrders: async (orderIds, status, token) => {
    // Validate orderIds
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      throw new Error('At least one order ID must be specified for bulk update.');
    }

    for (const id of orderIds) {
      if (typeof id !== 'string' || id.trim() === '') {
        throw new Error('Each order ID must be a valid non-empty string.');
      }
    }

    // Validate status
    if (typeof status !== 'string' || status.trim() === '') {
      throw new Error('New status must be a valid non-empty string.');
    }

    const normalizedStatus = status.trim().toLowerCase();

    const validStatuses = Object.values(ORDER_STATUSES);
    if (!validStatuses.includes(normalizedStatus)) {
      throw new Error(`Invalid status value: ${normalizedStatus}. Allowed statuses are: ${validStatuses.join(', ')}`);
    }

    try {
      const response = await fetch(`${ORDERS_API_URL}/orders/bulk-update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderIds: orderIds.map(id => id.trim()),
          status: normalizedStatus,
        }),
      });

      const data = await response.json();
      console.log('API Response for bulkUpdateOrders:', data); // Added log

      if (!response.ok) {
        throw new Error(data.message || 'Failed to bulk update orders');
      }

      return data;
    } catch (error) {
      console.error('Error bulk updating orders:', error);
      throw error;
    }
  },
};

export default orderService;
