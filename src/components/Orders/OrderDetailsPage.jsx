// src/components/Orders/OrderDetailsPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useOrders from '../../hooks/useOrders';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import toast from 'react-hot-toast';
import Select from 'react-select';
import ErrorBoundary from '../Common/ErrorBoundary';
import RefundForm from './RefundForm'; // Ensure RefundForm.jsx exists
import UpdateTrackingForm from './UpdateTrackingForm'; // Ensure UpdateTrackingForm.jsx exists
import ReturnForm from './ReturnForm'; // Ensure ReturnForm.jsx exists
import { convertAndFormatPriceDisplay } from '../../utils/currencyUtils';

/**
 * Format Date
 * @param {Date} date - Date object or string
 * @returns {string} - Formatted date string
 */
const formatDate = (date) => {
  if (!date) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleDateString(undefined, options);
};

/**
 * Format Address Object into a String
 * @param {Object} address - Address object with keys {street, city, state, zip, country}
 * @returns {string} - Formatted address string
 */
const formatAddress = (address) => {
  if (!address) return 'N/A';
  const { street, city, state, zip, country } = address;
  return `${street || ''}, ${city || ''}, ${state || ''}, ${zip || ''}, ${country || ''}`.replace(/(^,)|,$/g, '').trim() || 'N/A';
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    fetchOrderById,
    changeOrderStatus,
    cancelOrderById,
    updateTracking,
    processRefund,
    requestReturn,
  } = useOrders();

  const [order, setOrder] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const [newStatus, setNewStatus] = useState('');

  const allowedTransitions = {
    pending: ['processing', 'shipped', 'delivered', 'cancelled'],
    processing: ['shipped', 'delivered', 'cancelled'],
    shipped: ['delivered', 'refunded'],
    delivered: ['refunded'],
    cancelled: [],
    refunded: [],
  };

  useEffect(() => {
    const getOrder = async () => {
      try {
        const fetchedOrder = await fetchOrderById(id);
        console.log('Fetched Order:', fetchedOrder); // Debug log
        setOrder(fetchedOrder);
      } catch (err) {
        setError(err.message || 'Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, [fetchOrderById, id]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>Order not found.</p>;

  console.log('Current Order State:', order); // Debug log

  const nextAllowedStatuses = allowedTransitions[order.status] || [];

  const statusOptions = nextAllowedStatuses.map((status) => ({
    value: status,
    label: capitalize(status),
  }));

  if (nextAllowedStatuses.length === 0 && order.status) {
    statusOptions.push({ value: order.status, label: capitalize(order.status), isDisabled: true });
  }

  function capitalize(word) {
    if (typeof word !== 'string') {
      console.warn(`capitalize: expected a string but received ${typeof word}`);
      return '';
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const openUpdateModal = () => {
    setNewStatus(order.status);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error('Please select a new status.');
      return;
    }

    try {
      await changeOrderStatus(order._id, newStatus);
      setOrder((prevOrder) => ({ ...prevOrder, status: newStatus }));
      setIsUpdateModalOpen(false);
      toast.success('Order status updated successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to update order status.');
    }
  };

  const openCancelModal = () => {
    setIsCancelModalOpen(true);
  };

  const handleCancelOrder = async (reason) => {
    if (!reason) {
      toast.error('Please provide a reason for cancellation.');
      return;
    }

    try {
      await cancelOrderById(order._id, reason);
      setOrder((prevOrder) => ({ ...prevOrder, status: 'cancelled', cancellationReason: reason }));
      setIsCancelModalOpen(false);
      toast.success('Order cancelled successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order.');
    }
  };

  const openTrackingModal = () => {
    setIsTrackingModalOpen(true);
  };

  const handleUpdateTracking = async (trackingDetails) => {
    try {
      await updateTracking(order._id, trackingDetails);
      setOrder((prevOrder) => ({
        ...prevOrder,
        trackingDetails: trackingDetails,
      }));
      setIsTrackingModalOpen(false);
      toast.success('Tracking details updated successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to update tracking details.');
    }
  };

  const openRefundModal = () => {
    setIsRefundModalOpen(true);
  };

  const handleProcessRefund = async (refundData) => {
    if (!refundData.amount || !refundData.reason) {
      toast.error('Please provide both amount and reason for refund.');
      return;
    }

    try {
      await processRefund(order._id, refundData.amount, refundData.reason);
      // Optionally, refetch the order to get updated refund details
      const updatedOrder = await fetchOrderById(id);
      setOrder(updatedOrder);
      setIsRefundModalOpen(false);
      toast.success('Refund processed successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to process refund.');
    }
  };

  const openReturnModal = () => {
    setIsReturnModalOpen(true);
  };

  const handleRequestReturn = async (returnData) => {
    if (!returnData.items || returnData.items.length === 0 || !returnData.reason) {
      toast.error('Please provide items and reason for return.');
      return;
    }

    try {
      await requestReturn(order._id, returnData.items, returnData.reason);
      setIsReturnModalOpen(false);
      toast.success('Return request submitted successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to submit return request.');
    }
  };

  return (
    <ErrorBoundary>
      <div className="p-6">
        <Button onClick={() => navigate('/admin/orders')} className="bg-gray-500 hover:bg-gray-600 mb-4">
          Back to Orders
        </Button>

        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Order Details Display */}
          <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
          <p><strong>Order Number:</strong> {order.orderNumber || 'N/A'}</p>
          <p><strong>Status:</strong> {capitalize(order.status || 'N/A')}</p>
          <p><strong>Total Amount:</strong> {convertAndFormatPriceDisplay(order.totalAmount || 0)}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
          <p><strong>Payment Status:</strong> {capitalize(order.paymentStatus || 'N/A')}</p>
          <p><strong>Order Created At:</strong> {formatDate(order.createdAt)}</p>
          <p><strong>Last Updated At:</strong> {formatDate(order.updatedAt)}</p>
          {order.shippingDate && (
            <p><strong>Shipping Date:</strong> {formatDate(order.shippingDate)}</p>
          )}
          {order.deliveryDate && (
            <p><strong>Delivery Date:</strong> {formatDate(order.deliveryDate)}</p>
          )}
          {order.trackingDetails && (
            <div>
              <p><strong>Tracking ID:</strong> {order.trackingDetails.trackingId || 'N/A'}</p>
              <p><strong>Carrier:</strong> {capitalize(order.trackingDetails.carrier || 'N/A')}</p>
              {order.trackingDetails.trackingId && order.trackingDetails.carrier && (
                <p><strong>Tracking URL:</strong> <a href={`https://www.${order.trackingDetails.carrier.toLowerCase()}.com/track/${order.trackingDetails.trackingId}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Track Shipment</a></p>
              )}
            </div>
          )}
          <p><strong>Shipping Address:</strong> {formatAddress(order.shippingAddress)}</p>
          <p><strong>Billing Address:</strong> {formatAddress(order.billingAddress)}</p>
          {order.cancellationReason && (
            <p><strong>Cancellation Reason:</strong> {order.cancellationReason}</p>
          )}
          {order.refundedAmount !== undefined && (
            <p><strong>Refunded Amount:</strong> ₹{order.refundedAmount.toFixed(2)}</p>
          )}

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{order.totalAmountINR}</span>
              </div>
              {order.discountINR > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discountINR}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping Fee</span>
                <span className="font-medium">₹{order.shippingFee}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-800">Total</span>
                <span className="text-lg font-semibold">₹{order.finalAmount}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="ml-4 flex-grow">
                    <h4 className="font-semibold text-gray-800">{item.product.title}</h4>
                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Quantity:</span> {item.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Variant:</span> {item.variant}
                      </div>
                      <div>
                        <span className="font-medium">Packaging:</span> {item.packaging}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-800">₹{item.price * item.quantity}</div>
                    <div className="text-sm text-gray-500">₹{item.price} each</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Customer Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Contact Details</h4>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-medium">Name:</span> {order.customer.name}</p>
                  <p><span className="font-medium">Email:</span> {order.customer.email}</p>
                  <p><span className="font-medium">Phone:</span> {order.phone}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
                <div className="space-y-2 text-gray-600">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Payment Details</h4>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-medium">Method:</span> {order.paymentMethod.toUpperCase()}</p>
                  <p><span className="font-medium">Status:</span> {order.paymentStatus.toUpperCase()}</p>
                  {order.paymentDetails?.transactionId && (
                    <p><span className="font-medium">Transaction ID:</span> {order.paymentDetails.transactionId}</p>
                  )}
                </div>
              </div>
              {order.trackingDetails && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Tracking Information</h4>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-medium">Carrier:</span> {order.trackingDetails.carrier}</p>
                    <p><span className="font-medium">Tracking ID:</span> {order.trackingDetails.trackingId}</p>
                    <p><span className="font-medium">Last Updated:</span> {new Date(order.trackingDetails.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Status History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${order.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <div className="ml-4">
                  <p className="font-medium text-gray-800">Order Created</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {order.status !== 'pending' && (
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${order.status === 'processing' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-800">Processing</p>
                    <p className="text-sm text-gray-500">{new Date(order.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
              {['shipped', 'delivered'].includes(order.status) && (
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${order.status === 'shipped' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-800">Shipped</p>
                    <p className="text-sm text-gray-500">{order.shippingDate && new Date(order.shippingDate).toLocaleString()}</p>
                  </div>
                </div>
              )}
              {order.status === 'delivered' && (
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-800">Delivered</p>
                    <p className="text-sm text-gray-500">{order.deliveryDate && new Date(order.deliveryDate).toLocaleString()}</p>
                  </div>
                </div>
              )}
              {order.status === 'cancelled' && (
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-800">Cancelled</p>
                    <p className="text-sm text-gray-500">{new Date(order.updatedAt).toLocaleString()}</p>
                    {order.cancellationReason && (
                      <p className="text-sm text-gray-600 mt-1">Reason: {order.cancellationReason}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4">
            {nextAllowedStatuses.length > 0 && (
              <Button
                onClick={openUpdateModal}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Update Status
              </Button>
            )}
            {order.status !== 'cancelled' && order.status !== 'refunded' && (
              <Button
                onClick={openCancelModal}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Cancel Order
              </Button>
            )}
            {['shipped', 'delivered'].includes(order.status) && (
              <Button
                onClick={openTrackingModal}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update Tracking
              </Button>
            )}
            {['delivered', 'returned'].includes(order.status) && (
              <Button
                onClick={openRefundModal}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
              >
                Process Refund
              </Button>
            )}
            {order.status === 'delivered' && (
              <Button
                onClick={openReturnModal}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Request Return
              </Button>
            )}
          </div>
        </div>

        {/* Update Status Modal */}
        {isUpdateModalOpen && (
          <Modal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            title={`Update Status for ${order.orderNumber || 'Order'}`}
          >
            <div className="space-y-4">
              <Select
                options={statusOptions}
                value={statusOptions.find(option => option.value === newStatus)}
                onChange={(option) => setNewStatus(option.value)}
                placeholder="Select new status"
                isClearable
              />
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateStatus}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Cancel Order Modal */}
        {isCancelModalOpen && (
          <Modal
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            title={`Cancel Order ${order.orderNumber || ''}`}
          >
            <CancelOrderForm onSubmit={handleCancelOrder} />
          </Modal>
        )}

        {/* Update Tracking Modal */}
        {isTrackingModalOpen && (
          <Modal
            isOpen={isTrackingModalOpen}
            onClose={() => setIsTrackingModalOpen(false)}
            title={`Update Tracking for ${order.orderNumber || 'Order'}`}
          >
            <UpdateTrackingForm onSubmit={handleUpdateTracking} />
          </Modal>
        )}

        {/* Process Refund Modal */}
        {isRefundModalOpen && (
          <Modal
            isOpen={isRefundModalOpen}
            onClose={() => setIsRefundModalOpen(false)}
            title={`Process Refund for ${order.orderNumber || 'Order'}`}
          >
            <RefundForm onSubmit={handleProcessRefund} />
          </Modal>
        )}

        {/* Request Return Modal */}
        {isReturnModalOpen && (
          <Modal
            isOpen={isReturnModalOpen}
            onClose={() => setIsReturnModalOpen(false)}
            title={`Request Return for ${order.orderNumber || 'Order'}`}
          >
            <ReturnForm onSubmit={handleRequestReturn} />
          </Modal>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default OrderDetailsPage;