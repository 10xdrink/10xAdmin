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
import { formatPriceINRDisplay, convertAndFormatPriceDisplay } from '../../utils/currencyUtils'; // Import the currency formatter
import EnlargedX from '../../assets/EnlargedX.png'; // Import the logo image
import PageLoader from '../Common/PageLoader';
import { FiTrash2, FiEye, FiEdit2, FiArchive, FiFilter, FiRefreshCw, FiCheck, FiX, FiCalendar, FiDollarSign, FiTruck, FiPackage, FiPrinter, FiDownload, FiBarChart2 } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MetricCard from '../Common/MetricCard';

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
    bulkUpdateOrders,
    fetchOrderMetrics,
    permanentlyDeleteOrder,
  } = useOrders();
  
  // Basic state
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isCustomerFilterOpen, setIsCustomerFilterOpen] = useState(false);
  const [customerTypeFilter, setCustomerTypeFilter] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // table, grid, or summary
  const [selectedColumns, setSelectedColumns] = useState([
    'orderNumber', 'customer', 'amount', 'status', 'date', 'paymentMethod'
  ]);
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
  
  // Metrics state
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    refundedOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingRevenue: 0
  });
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  const ordersPerPage = 10;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: ordersPerPage,
      status: statusFilter ? statusFilter.value : undefined,
      search: searchQuery || undefined,
      sortField: sortField,
      sortOrder: sortOrder,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
      minPrice: priceRange.min || undefined,
      maxPrice: priceRange.max || undefined,
      customerType: customerTypeFilter?.value || undefined,
    };

    fetchAllOrders(params);
    loadOrderMetrics();
  }, [fetchAllOrders, currentPage, statusFilter, searchQuery, sortField, sortOrder, startDate, endDate, priceRange.min, priceRange.max, customerTypeFilter]);

  // Function to load metrics
  const loadOrderMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const metricsData = await fetchOrderMetrics();
      setMetrics({
        totalOrders: metricsData?.totalOrders || 0,
        pendingOrders: metricsData?.pendingOrders || 0,
        processingOrders: metricsData?.processingOrders || 0,
        shippedOrders: metricsData?.shippedOrders || 0,
        deliveredOrders: metricsData?.deliveredOrders || 0,
        cancelledOrders: metricsData?.cancelledOrders || 0,
        refundedOrders: metricsData?.refundedOrders || 0,
        totalRevenue: metricsData?.totalRevenue || 0,
        averageOrderValue: metricsData?.averageOrderValue || 0,
        pendingRevenue: metricsData?.pendingRevenue || 0
      });
    } catch (error) {
      console.error("Error loading metrics:", error);
      // Set fallback metrics
      setMetrics({
        totalOrders: totalOrders || 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        refundedOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingRevenue: 0
      });
    } finally {
      setLoadingMetrics(false);
    }
  };

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

  const customerTypeOptions = useMemo(
    () => [
      { value: 'new', label: 'New Customers' },
      { value: 'returning', label: 'Returning Customers' },
      { value: 'vip', label: 'VIP Customers' },
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
      await bulkUpdateOrders(selectedOrders, bulkData.newStatus);
      setSelectedOrders([]);
      setIsBulkUpdateModalOpen(false);
      toast.success('Bulk update successful.');
      loadOrderMetrics();
    } catch (err) {
      toast.error(err.message || 'Bulk update failed.');
    }
  };

  const handleDeleteClick = (order, permanent = false) => {
    setOrderToDelete(order);
    setIsPermanentDelete(permanent);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (isPermanentDelete) {
        await permanentlyDeleteOrder(orderToDelete._id);
        toast.success('Order permanently deleted');
      } else {
        await cancelOrderById(orderToDelete._id, "Admin initiated cancellation");
        toast.success('Order archived');
      }
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
      loadOrderMetrics();
    } catch (error) {
      toast.error(error.message || 'Failed to delete order');
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'processing': 'bg-blue-100 text-blue-800 border-blue-300',
      'shipped': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'delivered': 'bg-green-100 text-green-800 border-green-300',
      'cancelled': 'bg-red-100 text-red-800 border-red-300',
      'refunded': 'bg-purple-100 text-purple-800 border-purple-300',
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };
  
  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return <FiCalendar className="mr-1" />;
      case 'processing':
        return <FiPackage className="mr-1" />;
      case 'shipped':
        return <FiTruck className="mr-1" />;
      case 'delivered':
        return <FiCheck className="mr-1" />;
      case 'cancelled':
        return <FiX className="mr-1" />;
      case 'refunded':
        return <FiDollarSign className="mr-1" />;
      default:
        return null;
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const addFilter = (type, value, label) => {
    const newFilter = { type, value, label };
    setActiveFilters([...activeFilters, newFilter]);
  };

  const removeFilter = (index) => {
    const newFilters = [...activeFilters];
    const removedFilter = newFilters.splice(index, 1)[0];
    
    // Reset the corresponding filter
    if (removedFilter.type === 'status') {
      setStatusFilter(null);
    } else if (removedFilter.type === 'dateRange') {
      setDateRange([null, null]);
    } else if (removedFilter.type === 'priceRange') {
      setPriceRange({ min: '', max: '' });
    } else if (removedFilter.type === 'customerType') {
      setCustomerTypeFilter(null);
    }
    
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setStatusFilter(null);
    setDateRange([null, null]);
    setPriceRange({ min: '', max: '' });
    setCustomerTypeFilter(null);
    setActiveFilters([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleExportOrders = (format = 'csv') => {
    const selectedIds = selectedOrders.length > 0 ? selectedOrders : 'all';
    // Call your export function here
    toast.success(`Exporting orders as ${format.toUpperCase()}`);
  };

  const handlePrintInvoices = () => {
    if (selectedOrders.length === 0) {
      toast.error('Please select at least one order to print invoices');
      return;
    }
    toast.success(`Preparing to print ${selectedOrders.length} invoices`);
  };

  const handleColumnToggle = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const applyDateFilter = () => {
    if (startDate && endDate) {
      addFilter(
        'dateRange', 
        [startDate, endDate],
        `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
      );
    }
  };

  const applyPriceFilter = () => {
    if (priceRange.min || priceRange.max) {
      addFilter(
        'priceRange',
        priceRange,
        `₹${priceRange.min || '0'} - ₹${priceRange.max || '∞'}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] rounded-lg shadow-xl mb-6 mx-6 mt-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="px-6 py-6 md:px-10 w-full md:w-1/2 flex flex-col items-center md:items-start">
            <h1 className="text-4xl font-bold text-white quantico-bold-italic">
              ORDERS
            </h1>
            <p className="text-blue-100 mt-2 pt-sans-regular">
              Manage and track customer orders efficiently!
            </p>
          </div>
          <div className="hidden md:flex w-full md:w-1/2 h-32 overflow-hidden items-center justify-end mr-24">
            <img
              className="w-32 object-cover transition-transform duration-[2000ms] ease-in-out transform hover:-translate-y-10"
              src={EnlargedX}
              alt="10X Logo"
            />
          </div>
        </div>
      </div>
      
      <div className="px-6 py-3">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <MetricCard 
            title="Total Orders" 
            value={metrics.totalOrders} 
            isLoading={loadingMetrics} 
            iconType="orders" 
          />
          <MetricCard 
            title="Total Revenue" 
            value={`₹${metrics.totalRevenue.toLocaleString()}`} 
            isLoading={loadingMetrics} 
            iconType="revenue" 
            trend={10} // Example trend percentage
          />
          <MetricCard 
            title="Avg. Order Value" 
            value={`₹${metrics.averageOrderValue.toLocaleString()}`} 
            isLoading={loadingMetrics} 
            iconType="average" 
          />
          <MetricCard 
            title="Pending Revenue" 
            value={`₹${metrics.pendingRevenue.toLocaleString()}`} 
            isLoading={loadingMetrics} 
            iconType="pending" 
          />
          <MetricCard 
            title="Processing Orders" 
            value={metrics.processingOrders} 
            isLoading={loadingMetrics} 
            iconType="processing" 
          />
        </div>
        
        {/* Status Legend */}
        <div className="bg-white p-4 mb-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-2">Order Status</h3>
          <div className="flex flex-wrap gap-3">
            {statusOptions.map(status => (
              <div 
                key={status.value} 
                className={`flex items-center px-3 py-2 rounded-md ${getStatusColor(status.value)}`}
              >
                {getStatusIcon(status.value)}
                <span>{status.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Order Management</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FiFilter className="h-5 w-5" />
                <span>{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
              <button 
                onClick={() => setIsColumnsModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <FiBarChart2 className="h-5 w-5" />
                <span>Columns</span>
              </button>
              <div className="flex items-center border rounded-md overflow-hidden">
                <button 
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <i className="fas fa-table text-sm"></i>
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <i className="fas fa-th-large text-sm"></i>
                </button>
                <button 
                  onClick={() => setViewMode('summary')}
                  className={`px-3 py-1 ${viewMode === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <i className="fas fa-chart-pie text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-gray-500">Active Filters:</span>
              {activeFilters.map((filter, index) => (
                <div key={index} className="flex items-center bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <span className="mr-1">{filter.label}</span>
                  <button 
                    onClick={() => removeFilter(index)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button 
                onClick={clearAllFilters}
                className="text-xs text-red-600 hover:text-red-800 ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Basic Filters */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isFilterOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4 mb-4">
              <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(selected) => {
                    setStatusFilter(selected);
                    if (selected) {
                      addFilter('status', selected.value, `Status: ${selected.label}`);
                    }
                    setCurrentPage(1);
                  }}
                  isClearable
                  placeholder="Filter by Status"
                  className="w-full"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#E5E7EB',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#3B82F6',
                      },
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected 
                        ? '#3B82F6' 
                        : state.isFocused 
                          ? '#EFF6FF' 
                          : null,
                      '&:active': {
                        backgroundColor: '#DBEAFE',
                      },
                    }),
                  }}
                />
              </div>
              
              <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
                <Select
                  options={customerTypeOptions}
                  value={customerTypeFilter}
                  onChange={(selected) => {
                    setCustomerTypeFilter(selected);
                    if (selected) {
                      addFilter('customerType', selected.value, `Customer: ${selected.label}`);
                    }
                    setCurrentPage(1);
                  }}
                  isClearable
                  placeholder="Filter by Customer Type"
                  className="w-full"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#E5E7EB',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#3B82F6',
                      },
                    }),
                  }}
                />
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by Order Number or Customer"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchQuery('')}
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Advanced Filters Toggle */}
            <div className="mb-4">
              <button 
                onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                {isAdvancedFilterOpen ? 'Hide' : 'Show'} Advanced Filters
                <svg className={`ml-1 h-4 w-4 transform ${isAdvancedFilterOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Advanced Filters */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isAdvancedFilterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    isClearable={true}
                    placeholderText="Select date range"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {startDate && endDate && (
                    <button 
                      onClick={applyDateFilter}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Apply Date Filter
                    </button>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">₹</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <span className="text-gray-500">to</span>
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">₹</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  {(priceRange.min || priceRange.max) && (
                    <button 
                      onClick={applyPriceFilter}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Apply Price Filter
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Filter Actions */}
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-300"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons and Bulk Operations */}
        <div className="flex flex-wrap gap-3 mb-6">
          {selectedOrders.length > 0 && (
            <div className="flex-1 bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center justify-between">
              <span className="text-sm text-blue-800 font-medium">
                {selectedOrders.length} {selectedOrders.length === 1 ? 'order' : 'orders'} selected
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={openBulkUpdateModal}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:shadow-md"
                >
                  <FiEdit2 className="h-4 w-4" />
                  <span>Bulk Update</span>
                </button>
                <button
                  onClick={handlePrintInvoices}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 hover:shadow-md"
                >
                  <FiPrinter className="h-4 w-4" />
                  <span>Print Invoices</span>
                </button>
                <button
                  onClick={() => setSelectedOrders([])}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-300"
                >
                  <FiX className="h-4 w-4" />
                  <span>Clear Selection</span>
                </button>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <button 
              onClick={() => handleExportOrders('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 hover:shadow-md"
            >
              <FiDownload className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <div className="relative group">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 hover:shadow-md"
              >
                <FiRefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Orders Table */}
        {loading ? (
          <PageLoader 
            title="Loading Orders" 
            subtitle="Please wait while we fetch your orders..."
          />
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 text-red-700 animate-fadeIn">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        ) : Array.isArray(orders) && orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500 animate-fadeIn">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : viewMode === 'table' && Array.isArray(orders) ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedOrders.length === orders.length && orders.length > 0}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                        />
                      </div>
                    </th>
                    {selectedColumns.includes('orderNumber') && (
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('orderNumber')}
                      >
                        <div className="flex items-center">
                          <span>Order Number</span>
                          {sortField === 'orderNumber' && (
                            <span className="ml-1">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    )}
                    {selectedColumns.includes('date') && (
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center">
                          <span>Date</span>
                          {sortField === 'createdAt' && (
                            <span className="ml-1">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    )}
                    {selectedColumns.includes('customer') && (
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                    )}
                    {selectedColumns.includes('amount') && (
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('finalAmount')}
                      >
                        <div className="flex items-center">
                          <span>Amount</span>
                          {sortField === 'finalAmount' && (
                            <span className="ml-1">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    )}
                    {selectedColumns.includes('status') && (
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center">
                          <span>Status</span>
                          {sortField === 'status' && (
                            <span className="ml-1">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    )}
                    {selectedColumns.includes('paymentMethod') && (
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                    )}
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order, index) => (
                    <tr key={order._id} 
                      className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => toggleSelectOrder(order._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                        />
                      </td>
                      {selectedColumns.includes('orderNumber') && (
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 group hover:text-blue-600">
                              <HighlightText text={order.orderNumber} highlight={searchQuery} />
                            </span>
                            <span className="text-sm text-gray-500">
                              {order.items?.length || 0} items
                            </span>
                          </div>
                        </td>
                      )}
                      {selectedColumns.includes('date') && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                      )}
                      {selectedColumns.includes('customer') && (
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {order.customer?.name || 'N/A'}
                              {order.customer?.orderCount > 1 && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {order.customer.orderCount} orders
                                </span>
                              )}
                            </span>
                            <span className="text-sm text-gray-500">
                              {order.customer?.email || 'N/A'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {order.phone || 'N/A'}
                            </span>
                          </div>
                        </td>
                      )}
                      {selectedColumns.includes('amount') && (
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              ₹{order.finalAmount}
                            </span>
                            {order.discountINR > 0 && (
                              <span className="text-sm text-green-600">
                                -₹{order.discountINR} discount
                              </span>
                            )}
                            {order.finalAmount > 5000 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                High Value
                              </span>
                            )}
                          </div>
                        </td>
                      )}
                      {selectedColumns.includes('status') && (
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                              <div className="flex items-center">
                                {getStatusIcon(order.status)}
                                <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                              </div>
                            </span>
                            {order.paymentStatus && order.paymentStatus !== order.status && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                              </span>
                            )}
                          </div>
                        </td>
                      )}
                      {selectedColumns.includes('paymentMethod') && (
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {order.paymentMethod.toUpperCase()}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block text-left">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/admin/orders/${order._id}`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-all duration-300 hover:shadow-md flex items-center gap-1"
                              title="View Order Details"
                            >
                              <FiEye className="h-3.5 w-3.5" />
                              <span>View</span>
                            </button>
                            <div className="relative group">
                              <button
                                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition-all duration-300 hover:shadow-md flex items-center gap-1"
                              >
                                Actions
                                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                  <button 
                                    onClick={() => navigate(`/admin/orders/${order._id}/edit`)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <FiEdit2 className="inline mr-2" /> Edit Order
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteClick(order)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <FiArchive className="inline mr-2" /> Archive Order
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteClick(order, true)}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  >
                                    <FiTrash2 className="inline mr-2" /> Delete Permanently
                                  </button>
                                  <button 
                                    onClick={() => window.open(`/admin/orders/${order._id}/print`, '_blank')}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <FiPrinter className="inline mr-2" /> Print Invoice
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        ) : viewMode === 'grid' && Array.isArray(orders) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        <HighlightText text={order.orderNumber} highlight={searchQuery} />
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-900">{order.customer?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{order.customer?.email || 'N/A'}</p>
                  </div>
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="text-lg font-semibold text-gray-900">₹{order.finalAmount}</div>
                    <div className="text-sm text-gray-500">{order.items?.length || 0} items</div>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <button
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => toggleSelectOrder(order._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'summary' && Array.isArray(orders) ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Summary Charts would go here */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-2">Status Distribution</h4>
                <div className="flex flex-col space-y-3">
                  {statusOptions.map(status => (
                    <div key={status.value} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(status.value)}`}></div>
                        <span>{status.label}</span>
                      </div>
                      <span className="font-medium">
                        {metrics[`${status.value}Orders`] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-2">Revenue by Status</h4>
                <div className="h-40 flex items-center justify-center text-gray-500">
                  Chart Placeholder
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-2">Recent Trends</h4>
                <div className="h-40 flex items-center justify-center text-gray-500">
                  Chart Placeholder
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
        {/* Pagination for Grid View */}
        {viewMode === 'grid' && orders && orders.length > 0 && (
          <div className="mt-6 bg-white px-4 py-3 rounded-lg shadow-md">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Bulk Update Modal */}
      {isBulkUpdateModalOpen && (
        <Modal
          isOpen={isBulkUpdateModalOpen}
          onClose={() => setIsBulkUpdateModalOpen(false)}
          title="Bulk Update Orders"
        >
          <BulkUpdateForm
            onSubmit={handleBulkUpdate}
            onCancel={() => setIsBulkUpdateModalOpen(false)}
            selectedCount={selectedOrders.length}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title={isPermanentDelete ? "Permanently Delete Order" : "Archive Order"}
        >
          <div className="p-6">
            <div className={`mb-6 p-4 rounded-lg ${
              isPermanentDelete ? 'bg-red-50 border-l-4 border-red-500' : 'bg-yellow-50 border-l-4 border-yellow-500'
            }`}>
              <p className="text-sm">
                {isPermanentDelete 
                  ? "Are you sure you want to permanently delete this order? This action cannot be undone and will remove all associated data including refunds and returns."
                  : "Are you sure you want to archive this order? The order will be moved to archives but can be restored later."
                }
              </p>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`px-4 py-2 text-white rounded-md flex items-center gap-2 ${
                  isPermanentDelete 
                    ? 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800' 
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800'
                }`}
              >
                {isPermanentDelete ? <FiTrash2 className="w-4 h-4" /> : <FiArchive className="w-4 h-4" />}
                <span>{isPermanentDelete ? 'Permanently Delete' : 'Archive'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Column Selection Modal */}
      {isColumnsModalOpen && (
        <Modal
          isOpen={isColumnsModalOpen}
          onClose={() => setIsColumnsModalOpen(false)}
          title="Customize Table Columns"
        >
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {['orderNumber', 'date', 'customer', 'amount', 'status', 'paymentMethod'].map((column) => (
                <div key={column} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`column-${column}`}
                    checked={selectedColumns.includes(column)}
                    onChange={() => handleColumnToggle(column)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`column-${column}`} className="ml-2 text-gray-700 capitalize">
                    {column === 'orderNumber' ? 'Order Number' : column}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsColumnsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderListPage;
