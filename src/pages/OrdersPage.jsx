import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { 
  FiDownload, FiFilter, FiRefreshCw, FiX, FiPlus, FiSearch, 
  FiCalendar, FiDollarSign, FiPackage, FiTruck, FiAlertCircle,
  FiArrowUp, FiArrowDown, FiShoppingBag
} from 'react-icons/fi';
import { CSVLink } from 'react-csv';
import OrderList from '../components/OrderList';
import OrderDetailsModal from '../components/OrderDetailsModal';
import OrderEditModal from '../components/OrderEditModal';
import PageTitle from '../components/Common/PageTitle';
import Pagination from '../components/Common/Pagination';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { motion } from 'framer-motion';
import api from '../services/api';

// Constants for status and sort options
const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
];

const SORT_OPTIONS = [
  { value: 'createdAt|desc', label: 'Newest First' },
  { value: 'createdAt|asc', label: 'Oldest First' },
  { value: 'totalAmount|desc', label: 'Highest Amount' },
  { value: 'totalAmount|asc', label: 'Lowest Amount' },
];

const OrdersPage = () => {
  // State for orders
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportData, setExportData] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  
  // State for order statistics
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });
  
  // State for pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  
  // State for filters
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt|desc',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // State for modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // State for selected orders
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  // Function to load order statistics
  const loadOrderStats = useCallback(async () => {
    try {
      const response = await api.get('/api/orders/stats');
      setOrderStats(response.data);
    } catch (err) {
      console.error('Failed to load order statistics:', err);
    }
  }, []);
  
  // Function to load orders with filters and pagination
  const loadOrders = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const [sortField, sortOrder] = filters.sortBy.split('|');
      
      const params = {
        page,
        limit: pagination.pageSize,
        sortBy: sortField,
        sortOrder,
        status: filters.status,
        search: filters.search,
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
      };
      
      const response = await api.get('/api/orders', { params });
      
      setOrders(response.data.orders);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems,
        pageSize: response.data.pageSize,
      });
      
      // Load order statistics after orders are loaded
      loadOrderStats();
    } catch (err) {
      setError(err.message || 'Failed to load orders');
      toast.error(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.pageSize, loadOrderStats]);
  
  // Load orders on mount and when filters change
  useEffect(() => {
    loadOrders(1);
  }, [filters, loadOrders]);
  
  // Export orders to CSV
  const prepareExportData = async () => {
    setExportLoading(true);
    
    try {
      // Get all orders for export without pagination
      const [sortField, sortOrder] = filters.sortBy.split('|');
      
      const params = {
        page: 1,
        limit: 1000, // Get a large number of orders
        sortBy: sortField,
        sortOrder,
        status: filters.status,
        search: filters.search,
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
        export: true, // Signal that this is for export
      };
      
      const response = await api.get('/api/orders', { params });
      
      // Format data for CSV export
      const data = response.data.orders.map(order => ({
        'Order ID': order.orderId,
        'Date': new Date(order.createdAt).toLocaleDateString(),
        'Customer': order.customer?.name || 'N/A',
        'Email': order.customer?.email || 'N/A',
        'Status': order.status,
        'Items': order.items?.length || 0,
        'Total Amount': order.totalAmount?.toFixed(2) || '0.00',
        'Payment Method': order.paymentMethod || 'N/A',
      }));
      
      setExportData(data);
      toast.success(`Prepared ${data.length} orders for export`);
    } catch (err) {
      toast.error(err.message || 'Failed to prepare orders for export');
    } finally {
      setExportLoading(false);
    }
  };
  
  // Handle order selection
  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };
  
  // Handle select all orders
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(orders.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };
  
  // Handle view order
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };
  
  // Handle edit order
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };
  
  // Handle delete order
  const handleDeleteOrder = async (orderId) => {
    try {
      await api.delete(`/api/orders/${orderId}`);
      loadOrders(pagination.currentPage);
      toast.success('Order archived successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to archive order');
    }
  };
  
  // Handle permanent delete order
  const handlePermanentDeleteOrder = async (orderId) => {
    try {
      await api.delete(`/api/orders/${orderId}/permanent`);
      loadOrders(pagination.currentPage);
      toast.success('Order permanently deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete order permanently');
    }
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    loadOrders(page);
  };
  
  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      status: '',
      search: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'createdAt|desc',
    });
  };
  
  // Render pagination component
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;
    
    return (
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    );
  };
  
  // If loading first time
  if (loading && !orders.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    );
  }
  
  // If error loading orders
  if (error && !orders.length) {
    return (
      <div className="p-8 bg-red-50 rounded-lg border border-red-200 text-center">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Error Loading Orders</h2>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={() => loadOrders(1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Define animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Page header with gradient */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 rounded-xl shadow-xl overflow-hidden"
        variants={itemVariants}
      >
        <div className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <PageTitle title="Orders Management" className="text-white mb-2" />
            <p className="text-blue-100 text-sm">
              Manage all customer orders, process returns and track shipments
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {exportData.length > 0 ? (
              <CSVLink
                data={exportData}
                filename={`orders-export-${new Date().toISOString().slice(0, 10)}.csv`}
                className="btn-primary bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm"
                target="_blank"
              >
                <FiDownload size={18} />
                <span>Download CSV ({exportData.length})</span>
              </CSVLink>
            ) : (
              <motion.button
                onClick={prepareExportData}
                disabled={exportLoading}
                className="btn-secondary bg-white text-blue-700 px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-blue-50 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {exportLoading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span>Preparing Export...</span>
                  </>
                ) : (
                  <>
                    <FiDownload size={18} />
                    <span>Export to CSV</span>
                  </>
                )}
              </motion.button>
            )}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary px-4 py-2 rounded-md flex items-center gap-2 shadow-sm transition-all ${
                showFilters 
                  ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' 
                  : 'bg-white text-blue-700 hover:bg-blue-50'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiFilter size={18} />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </motion.button>
            <motion.button
              onClick={() => loadOrders(pagination.currentPage)}
              className="btn-secondary bg-white text-blue-700 px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-blue-50 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              title="Refresh Orders"
            >
              <FiRefreshCw size={18} />
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>
        
        {/* Statistics cards */}
        <div className="bg-white/10 backdrop-blur-sm p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <motion.div 
              className="bg-white/30 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
              whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-100">Total Orders</p>
                  <h3 className="text-2xl font-bold text-white">{orderStats.totalOrders || pagination.totalItems}</h3>
                </div>
                <div className="p-3 bg-blue-500 bg-opacity-50 rounded-full">
                  <FiShoppingBag className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/30 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
              whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-100">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-white">₹{(orderStats.totalRevenue || 0).toLocaleString('en-IN')}</h3>
                </div>
                <div className="p-3 bg-green-500 bg-opacity-50 rounded-full">
                  <FiDollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/30 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
              whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-100">Pending Orders</p>
                  <h3 className="text-2xl font-bold text-white">{orderStats.pendingOrders || 0}</h3>
                </div>
                <div className="p-3 bg-yellow-500 bg-opacity-50 rounded-full">
                  <FiCalendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/30 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
              whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-100">Shipped Orders</p>
                  <h3 className="text-2xl font-bold text-white">{orderStats.shippedOrders || 0}</h3>
                </div>
                <div className="p-3 bg-blue-500 bg-opacity-50 rounded-full">
                  <FiTruck className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/30 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
              whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-100">Avg. Order Value</p>
                  <h3 className="text-2xl font-bold text-white">₹{(orderStats.averageOrderValue || 0).toLocaleString('en-IN')}</h3>
                </div>
                <div className="p-3 bg-indigo-500 bg-opacity-50 rounded-full">
                  <FiPackage className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Filters area with animations */}
      {showFilters && (
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-5 border border-gray-100"
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ 
            opacity: 1, 
            height: 'auto',
            marginTop: 16, 
            transition: {
              type: "spring", 
              stiffness: 300, 
              damping: 24
            }
          }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FiFilter className="mr-2 text-blue-600" /> Filter Orders
            </h3>
            <motion.button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 px-3 py-1 rounded-md hover:bg-blue-50"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiX size={16} />
              Clear Filters
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="relative">
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pl-3 pr-10 py-2 text-sm"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiArrowDown className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <div className="relative">
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pl-3 pr-10 py-2 text-sm"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiArrowDown className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2 text-sm"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiCalendar className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2 text-sm"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiCalendar className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Orders
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pl-10 py-2 text-sm"
                  placeholder="Search by Order ID, Customer Name, Email, or Phone"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Order list */}
      <motion.div variants={itemVariants}>
        <OrderList
          orders={orders}
          onView={handleViewOrder}
          onUpdate={handleEditOrder}
          onDelete={handleDeleteOrder}
          onPermanentDelete={handlePermanentDeleteOrder}
          onRefresh={() => loadOrders(pagination.currentPage)}
          selectedOrders={selectedOrders}
          onSelectOrder={handleSelectOrder}
          onSelectAll={handleSelectAll}
        />
      </motion.div>
      
      {/* Pagination */}
      <motion.div className="mt-6" variants={itemVariants}>
        {renderPagination()}
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {orders.length} of {pagination.totalItems} orders
        </div>
      </motion.div>
      
      {/* Order detail modal */}
      {isViewModalOpen && selectedOrder && (
        <OrderDetailsModal
          isOpen={isViewModalOpen}
          order={selectedOrder}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
      
      {/* Order edit modal */}
      {isEditModalOpen && selectedOrder && (
        <OrderEditModal
          isOpen={isEditModalOpen}
          order={selectedOrder}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedOrder(null);
          }}
          onUpdate={() => {
            setIsEditModalOpen(false);
            setSelectedOrder(null);
            loadOrders(pagination.currentPage);
          }}
        />
      )}
    </motion.div>
  );
};

export default OrdersPage; 