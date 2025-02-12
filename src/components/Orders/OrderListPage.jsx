// src/components/Orders/OrderListPage.jsx

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import useOrders from '../../hooks/useOrders';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import Select from 'react-select';
import Pagination from '../Common/Pagination';
import HighlightText from '../HighlightText';
import BulkUpdateForm from './BulkUpdateForm'; // Ensure this import exists and points to the correct file

const OrderListPage = () => {
  const navigate = useNavigate();
  const {
    orders,
    totalOrders,
    loading,
    error,
    fetchAllOrders,
    changeOrderStatus,
    cancelOrderById,
    bulkUpdateOrders, // Now correctly provided by the context
  } = useOrders();
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);

  const ordersPerPage = 10;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: ordersPerPage,
      status: statusFilter ? statusFilter.value : undefined,
      search: searchQuery || undefined,
      sortField: 'createdAt',
      sortOrder: 'desc',
      // Removed token from params as it's accessed via context
    };
    fetchAllOrders(params); // Pass the params without token
  }, [fetchAllOrders, currentPage, statusFilter, searchQuery]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const statusOptions = useMemo(
    () => [
      { value: 'pending', label: 'Pending' },
      { value: 'processing', label: 'Processing' },
      { value: 'shipped', label: 'Shipped' },
      { value: 'delivered', label: 'Delivered' },
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'refunded', label: 'Refunded' },
    ],
    []
  );

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order._id));
    }
  };

  const toggleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const openBulkUpdateModal = () => {
    if (selectedOrders.length === 0) {
      toast.error('At least one order ID must be specified for bulk update.');
      return;
    }
    setIsBulkUpdateModalOpen(true);
  };

  const handleBulkUpdate = async (bulkData) => {
    if (!bulkData.newStatus) {
      toast.error('Please select a new status.');
      return;
    }

    try {
      await bulkUpdateOrders(selectedOrders, bulkData.newStatus); // Token is handled within the context
      setSelectedOrders([]);
      setIsBulkUpdateModalOpen(false);
      toast.success('Bulk update successful.');
    } catch (err) {
      toast.error(err.message || 'Bulk update failed.');
    }
  };

  const handleCancelOrder = async (orderId, reason) => {
    try {
      await cancelOrderById(orderId, reason); // Token is handled within the context
      toast.success(`Order ${orderId} cancelled successfully.`);
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order.');
    }
  };

  const headers = ['Select', 'Order Number', 'Customer', 'Status', 'Total', 'Created At', 'Actions'];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 space-y-4 md:space-y-0">
        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          isClearable
          placeholder="Filter by Status"
          className="w-full md:w-1/4"
        />

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Order Number or Customer"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Bulk Update Button */}
        {selectedOrders.length > 0 && (
          <Button
            onClick={openBulkUpdateModal}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Bulk Update
          </Button>
        )}
      </div>

      {/* Orders Table */}
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : Array.isArray(orders) && orders.length === 0 ? (
        <p>No orders found.</p>
      ) : Array.isArray(orders) ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="py-3 px-6 text-left">
                    {header === 'Select' ? (
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === orders.length && orders.length > 0}
                        onChange={toggleSelectAll}
                      />
                    ) : (
                      header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-100">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => toggleSelectOrder(order._id)}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <HighlightText text={order.orderNumber} highlight={searchQuery} />
                  </td>
                  <td className="py-4 px-6">
                    {order.customer ? order.customer.name : 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        order.status === 'delivered'
                          ? 'bg-green-500'
                          : order.status === 'cancelled' || order.status === 'refunded'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 flex space-x-2">
                    <Button
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => openBulkUpdateModal()}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Update Status
                    </Button>
                    <Button
                      onClick={() => handleCancelOrder(order._id, 'Cancelled via bulk action')}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Unexpected error occurred.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Bulk Update Modal */}
      {isBulkUpdateModalOpen && (
        <Modal
          isOpen={isBulkUpdateModalOpen}
          onClose={() => setIsBulkUpdateModalOpen(false)}
          title="Bulk Update Orders"
        >
          <BulkUpdateForm onSubmit={handleBulkUpdate} />
        </Modal>
      )}
    </div>
  );
};

export default OrderListPage;
