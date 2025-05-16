import React, { useState, useEffect } from 'react';
import { FiTrash2, FiEye, FiEdit2, FiArchive, FiDownload, FiFilter, FiRefreshCw, FiCheck, FiAlertTriangle, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import Modal from './Common/Modal';
import Button from './Common/Button';
import toast from 'react-hot-toast';
import StatusBadge from './Common/StatusBadge';

const OrderList = ({ 
  orders, 
  onView, 
  onUpdate, 
  onDelete,
  onPermanentDelete,
  onExport,
  onRefresh,
  selectedOrders,
  onSelectOrder,
  onSelectAll 
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);

  useEffect(() => {
    // Trigger animation when orders change
    setAnimateRows(true);
    const timer = setTimeout(() => setAnimateRows(false), 500);
    return () => clearTimeout(timer);
  }, [orders]);

  const handleDeleteClick = (orderId, permanent = false) => {
    setDeleteOrderId(orderId);
    setIsPermanentDelete(permanent);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (isPermanentDelete) {
        await onPermanentDelete(deleteOrderId);
        toast.success('Order permanently deleted');
      } else {
        await onDelete(deleteOrderId);
        toast.success('Order archived');
      }
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete order');
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'processing': 'bg-blue-100 text-blue-800 border-blue-300',
      'shipped': 'bg-green-100 text-green-800 border-green-300',
      'delivered': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'cancelled': 'bg-red-100 text-red-800 border-red-300',
      'returned': 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] p-4 text-white">
        <h2 className="text-lg font-bold">Customer Orders</h2>
        <p className="text-sm opacity-80">Manage order details, status and process customer requests</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={(e) => onSelectAll(e.target.checked)}
                  />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr 
                key={order._id}
                className={`hover:bg-blue-50 transition-all duration-300 ${
                  animateRows ? 'animate-fadeIn' : ''
                } ${selectedOrders.includes(order._id) ? 'bg-blue-50' : ''}
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                style={{animationDelay: `${index * 50}ms`}}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => onSelectOrder(order._id)}
                    />
                    <span className="checkmark"></span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    #{order.orderId}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center space-x-1 mb-1">
                    <span className="inline-block w-2 h-2 bg-gray-300 rounded-full"></span>
                    <span>{format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center space-x-1">
                    <span className="inline-block w-2 h-2 bg-blue-300 rounded-full"></span>
                    <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {order.customer.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.customer.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </div>
                  {order.discount > 0 && (
                    <div className="text-xs text-green-600 flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                      -₹{order.discount.toLocaleString('en-IN')} discount
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                  {order.paymentStatus && (
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <span className={`inline-block w-2 h-2 ${
                        order.paymentStatus.toLowerCase() === 'paid' ? 'bg-green-400' : 
                        order.paymentStatus.toLowerCase() === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                      } rounded-full mr-1`}></span>
                      Payment: {order.paymentStatus}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-1">
                    <button
                      onClick={() => onView(order)}
                      className="text-blue-600 hover:text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                      title="View Details"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onUpdate(order)}
                      className="text-green-600 hover:text-white p-2 rounded-full hover:bg-green-600 transition-colors duration-300"
                      title="Edit Order"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(order._id)}
                      className="text-red-600 hover:text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                      title="Archive Order"
                    >
                      <FiArchive className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(order._id, true)}
                      className="text-red-600 hover:text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                      title="Permanently Delete"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <FiAlertTriangle className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">No Orders Found</h3>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
          
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto shadow-xl p-6 transform transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isPermanentDelete ? 'Permanently Delete Order' : 'Archive Order'}
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="mt-4">
              {isPermanentDelete ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiAlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        This action <span className="font-bold">cannot be undone</span>. The order will be permanently removed from the database.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mb-4">
                  The order will be archived and can be restored later if needed.
                </p>
              )}
              
              <p className="mb-4 text-gray-700">
                Are you sure you want to {isPermanentDelete ? 'permanently delete' : 'archive'} this order?
              </p>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className={`px-4 py-2 rounded-md text-white focus:outline-none ${
                    isPermanentDelete 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isPermanentDelete ? 'Delete Permanently' : 'Archive Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .checkbox-wrapper {
          position: relative;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default OrderList; 