// src/pages/Dashboard.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useUsers } from '../contexts/UserContext';
import orderService from '../api/orderService';
import productService from '../api/productService';
import blogService from '../api/blogService';
import couponService from '../api/couponService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer
} from 'recharts';

// Icons
import { 
  Users, DollarSign, ShoppingCart, BarChart2, Clock,
  Package, TrendingUp, AlertTriangle, ArrowUpRight, 
  ArrowDownRight, Calendar, Search
} from 'react-feather';

// Indian states data for sales metrics
const indianStates = [
  { name: 'Maharashtra', code: 'MH' },
  { name: 'Delhi', code: 'DL' },
  { name: 'Karnataka', code: 'KA' },
  { name: 'Tamil Nadu', code: 'TN' },
  { name: 'Gujarat', code: 'GJ' },
  { name: 'Uttar Pradesh', code: 'UP' }
];

// Import the currency utility functions
import { convertAndFormatPrice, formatPriceINR } from '../utils/currencyUtils';

// Currency formatting function for Indian Rupee
const formatIndianCurrency = (amount) => {
  if (amount === null || amount === undefined) return "0.00";
  
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle non-numeric values
  if (isNaN(numAmount)) return "0.00";
  
  // Convert USD to INR (using current exchange rate of approximately 1 USD = 83 INR)
  // Note: In a real application, you would use an API to get the current exchange rate
  const inrAmount = numAmount * 83;
  
  // Format with Indian thousands separators and 2 decimal places
  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(inrAmount);
};

// Add a function to convert USD to INR for raw calculations
const convertUsdToInr = (usdAmount) => {
  if (!usdAmount || isNaN(usdAmount)) return 0;
  // Convert USD to INR (using current exchange rate of approximately 1 USD = 83 INR)
  return usdAmount * 83;
};

import PageLoader from '../components/Common/PageLoader';

const Dashboard = () => {
  const { countUsersByRole, getTotalUserCount, exportUsers } = useUsers();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalOrders: 0,
    ordersDelivered: 0,
    totalRevenue: 0,
    orderStatus: {},
    blogStatus: {
      published: 0,
      draft: 0
    },
    recentOrders: [],
    topSellingProducts: [],
    recentBlogs: [],
    topStates: []
  });

  // Date range (30 days default)
  const [dateRange, setDateRange] = useState(30);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch users data
        const totalUsers = await getTotalUserCount();
        console.log('Total Users:', totalUsers);
        
        // Fetch orders data with explicit token
        const authToken = localStorage.getItem('adminToken');
        console.log('Using token:', authToken ? 'Token available' : 'No token');
        
        // Date range calculation - properly format dates
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - dateRange);
        
        const dateFrom = startDate.toISOString();
        const dateTo = endDate.toISOString();
        
        // Initialize response holders
        let ordersResponse, recentOrdersResponse, productsResponse, blogsResponse, couponsResponse;
        
        // Fetch orders data with try/catch for each request
        try {
          ordersResponse = await orderService.getOrderMetrics({ 
            dateFrom,
            dateTo
          }, authToken);
          console.log('Order Metrics Response:', ordersResponse);
        } catch (orderErr) {
          console.error('Error fetching order metrics:', orderErr);
          ordersResponse = { data: { totalOrders: 0, grossRevenue: 0 } };
          toast.error('Failed to load order metrics');
        }
        
        // Fetch recent orders
        try {
          recentOrdersResponse = await orderService.getAllOrders({
            page: 1,
            limit: 5,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          }, authToken);
          console.log('Recent Orders Response:', recentOrdersResponse);
        } catch (recentOrdersErr) {
          console.error('Error fetching recent orders:', recentOrdersErr);
          recentOrdersResponse = { data: [] };
          toast.error('Failed to load recent orders');
        }
        
        // Fetch products with error handling
        try {
          productsResponse = await productService.getAllProducts({
            page: 1,
            limit: 5,
            sortBy: 'totalSold',
            sortOrder: 'desc'
          });
          console.log('Products Response:', productsResponse);
          
          // Check if the response indicates an error
          if (!productsResponse.success) {
            console.error('Products API returned an error:', productsResponse.error);
            toast.error(`Failed to load top products: ${productsResponse.error}`);
          }
        } catch (productsErr) {
          console.error('Error fetching products:', productsErr);
          productsResponse = { products: [], success: false };
          toast.error('Failed to load top products');
        }
        
        // Fetch blogs
        try {
          blogsResponse = await blogService.getAllBlogs({
            page: 1,
            limit: 5,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          });
          console.log('Blogs Response:', blogsResponse);
        } catch (blogsErr) {
          console.error('Error fetching blogs:', blogsErr);
          blogsResponse = { data: [] };
          toast.error('Failed to load blog data');
        }
        
        // Fetch coupons
        try {
          couponsResponse = await couponService.getAllCoupons({
            page: 1,
            limit: 5
          });
          console.log('Coupons Response:', couponsResponse);
        } catch (couponsErr) {
          console.error('Error fetching coupons:', couponsErr);
          couponsResponse = { data: [] };
          toast.error('Failed to load coupon data');
        }
        
        // Order status counts from order metrics
        const orderStatus = {
          processing: ordersResponse?.data?.processingOrders || 0,
          shipped: ordersResponse?.data?.shippedOrders || 0,
          delivered: ordersResponse?.data?.deliveredOrders || 0,
          refunded: ordersResponse?.data?.refundedOrders || 0
        };
        
        // Count blog posts by status - handle potentially undefined data
        const blogPosts = blogsResponse?.data || [];
        const publishedBlogs = blogPosts.filter(blog => blog && blog.status === 'published').length;
        const draftBlogs = blogPosts.filter(blog => blog && blog.status === 'draft').length;
        
        // Generate sales data by Indian states (using order data by state if available)
        // For now, using a simulated approach while awaiting backend implementation
        const ordersByState = {};
        const orderItems = recentOrdersResponse?.data || [];
        
        // Simulate state distribution based on orders if we have any
        if (orderItems.length > 0) {
          indianStates.forEach(state => {
            ordersByState[state.code] = 0;
          });
          
          // Randomly assign orders to states for demonstration
          orderItems.forEach(order => {
            const randomStateIndex = Math.floor(Math.random() * indianStates.length);
            const stateCode = indianStates[randomStateIndex].code;
            ordersByState[stateCode] = (ordersByState[stateCode] || 0) + (order.totalAmount || 0);
          });
        }
        
        // Sort top states by amount (descending)
        const sortedTopStates = indianStates.map(state => {
          // Use actual data if available, otherwise generate representative data
          const actualAmount = ordersByState[state.code] || 0;
          const salesAmount = actualAmount > 0 ? 
            actualAmount : 
            Math.floor(Math.random() * 5000) + 3000;
          
          // Determine growth direction (would ideally be based on historical data)
          const growth = Math.random() > 0.5 ? 'up' : 'down';
          
          return {
            name: state.name,
            code: state.code,
            amount: Math.round(salesAmount),
            growth
          };
        }).sort((a, b) => b.amount - a.amount); // Sort by amount descending
        
        // Process coupons and sort by usage count
        const couponsData = couponsResponse?.data || [];
        const activeCoupons = couponsData.filter(coupon => coupon && coupon.isActive).length;
        const expiredCoupons = couponsData.filter(coupon => coupon && !coupon.isActive).length;
        
        // Sort coupons by usedCount (if available)
        const sortedCoupons = [...couponsData].sort((a, b) => {
          const countA = a.usedCount || 0;
          const countB = b.usedCount || 0;
          return countB - countA; // Descending order
        });
        
        // Sort products by total sold
        const sortedProducts = [...(productsResponse?.products || productsResponse?.data || [])].sort((a, b) => {
          const soldA = a.totalSold || 0;
          const soldB = b.totalSold || 0;
          return soldB - soldA; // Descending order
        });
        
        setDashboardData({
          totalUsers: totalUsers || 0,
          totalOrders: ordersResponse?.data?.totalOrders || 0,
          ordersDelivered: orderStatus.delivered || 0,
          totalRevenue: convertUsdToInr(ordersResponse?.data?.grossRevenue) || 0,
          orderStatus,
          blogStatus: {
            published: publishedBlogs || 0,
            draft: draftBlogs || 0
          },
          recentOrders: recentOrdersResponse?.data?.map(order => ({
            ...order,
            totalAmount: convertUsdToInr(order.totalAmount)
          })) || [],
          topSellingProducts: sortedProducts.map(product => ({
            ...product,
            price: convertUsdToInr(product.price)
          })),
          activeCoupons,
          expiredCoupons,
          coupons: sortedCoupons.map(coupon => ({
            ...coupon,
            discount: coupon.discountType === 'percentage' ? coupon.discount : convertUsdToInr(coupon.discount)
          })),
          topStates: sortedTopStates.map(state => ({
            ...state,
            amount: convertUsdToInr(state.amount)
          })),
          timeRange: {
            start: dateFrom,
            end: dateTo
          }
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Still set some data even if there's an error
        setDashboardData(prevData => ({
          ...prevData,
          totalUsers: prevData.totalUsers || 0,
          totalOrders: prevData.totalOrders || 0,
          ordersDelivered: prevData.ordersDelivered || 0,
          totalRevenue: prevData.totalRevenue || 0,
        }));
        toast.error('Failed to load some dashboard data: ' + (error.message || 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, dateRange, getTotalUserCount]);

  const handleExport = () => {
    toast.promise(
      exportUsers('csv'),
      {
        loading: 'Exporting users...',
        success: 'Users exported successfully!',
        error: (err) => `Export failed: ${err.message}`
      }
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <PageLoader 
        title="Loading Dashboard" 
        subtitle="Please wait while we fetch your dashboard data..."
      />
    );
  }

  // Format for recent orders
  const formatRecentOrders = () => {
    if (!dashboardData.recentOrders || dashboardData.recentOrders.length === 0) {
      // Return placeholder data if no orders are available
      return Array(3).fill().map((_, i) => ({
        id: `placeholder-${i}`,
        product: `Sample Product ${i+1}`,
        price: '₹0.00',
        deliveryDate: 'N/A'
      }));
    }
    
    return dashboardData.recentOrders.map(order => {
      try {
        // Find the first item in the order to display as the main product
        const mainProduct = order.items && order.items.length > 0 
          ? order.items[0] 
          : null;
          
        const productName = mainProduct?.product?.title || 
                           (mainProduct?.product?.name) || 
                           'Product Details Not Available';
                           
        // Use the formatPriceINR function for the price
        const price = order.totalAmount 
          ? "₹" + formatIndianCurrency(order.totalAmount)
          : '₹0.00';
          
        const deliveryDate = order.createdAt 
          ? new Date(order.createdAt).toLocaleDateString('en-US', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            })
          : 'Date not available';
          
        return {
          id: order._id || `order-${Math.random().toString(36).substring(7)}`,
          product: productName.length > 25 ? `${productName.substring(0, 25)}...` : productName,
          price,
          deliveryDate
        };
      } catch (error) {
        console.error('Error formatting order:', error, order);
        return {
          id: `error-${Math.random().toString(36).substring(7)}`,
          product: 'Error Parsing Order Data',
          price: '₹0.00',
          deliveryDate: 'N/A'
        };
      }
    });
  };

  return (
    <div className="bg-light-grey min-h-screen pb-8 font-poppins ">
      {/* Header */}
      <div className="bg-gradient-primary p-6 border-b border-gray-200 mb-6 text-white mx-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-quantico italic tracking-wide uppercase">Dashboard</h1>
            <p className="text-gray-100 mt-1 font-pt-sans">Welcome back! Here's what's happening with your store.</p>
          </div>
          <div className="flex space-x-4">
            <div className="relative group" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between w-44 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/30 rounded-md text-sm text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-white/80" />
                  <span>Last {dateRange} days</span>
            </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              
              <div 
                className={`${dropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'} absolute top-full left-0 mt-1 w-44 rounded-md shadow-lg bg-white border border-gray-200 divide-y divide-gray-100 ring-1 ring-black ring-opacity-5 z-20 transition-all duration-150 ease-in-out`}
              >
                <div className="py-1">
                  {[
                    { value: 7, label: 'Last 7 days' },
                    { value: 30, label: 'Last 30 days' },
                    { value: 90, label: 'Last 90 days' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setDateRange(option.value);
                        setDropdownOpen(false);
                      }}
                      className={`${
                        dateRange === option.value 
                          ? 'bg-primary-blue/10 text-primary-blue' 
                          : 'text-gray-700 hover:bg-gray-50'
                      } group flex w-full items-center px-4 py-2.5 text-sm`}
                    >
                      {dateRange === option.value && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                      )}
                      <span className={dateRange === option.value ? "" : "ml-6"}>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
        onClick={handleExport}
              className="bg-white text-primary-blue px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Export Users
            </button>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {/* Total Orders Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-full">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">+ 1.56%</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-deep-navy">{dashboardData.totalOrders || 0}</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Total Orders</p>
            </div>
            <div className="mt-3 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min((dashboardData.totalOrders / 100) * 100, 100)}%` }}></div>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary-blue"
                  >
                    <path
                      d="M12 16V14M12 11V8M17 20.5H7C5.89543 20.5 5 19.6046 5 18.5V5.5C5 4.39543 5.89543 3.5 7 3.5H17C18.1046 3.5 19 4.39543 19 5.5V18.5C19 19.6046 18.1046 20.5 17 20.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.25 8C12.25 8.13807 12.1381 8.25 12 8.25C11.8619 8.25 11.75 8.13807 11.75 8C11.75 7.86193 11.8619 7.75 12 7.75C12.1381 7.75 12.25 7.86193 12.25 8Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <span className="text-sm text-primary-blue font-medium">+ 1.56%</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-deep-navy">
                ₹{formatIndianCurrency(dashboardData.totalRevenue || 0)}
              </h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Total Revenue</p>
            </div>
            <div className="mt-3 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-primary-blue h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Orders Delivered Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Package className="h-5 w-5 text-purple" />
                </div>
                <span className="text-sm text-purple font-medium">0.00%</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-deep-navy">
                {dashboardData.ordersDelivered || 0}
              </h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Orders Delivered</p>
            </div>
            <div className="mt-3 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-purple h-2 rounded-full" style={{ width: `${Math.min((dashboardData.ordersDelivered / (dashboardData.totalOrders || 1)) * 100, 100)}%` }}></div>
            </div>
          </div>

            {/* Total Users Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-100 rounded-full">
                  <Users className="h-5 w-5 text-amber-500" />
                </div>
                <span className="text-sm text-amber-500 font-medium">+ 1.56%</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-deep-navy">{dashboardData.totalUsers}</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Total Users</p>
            </div>
            <div className="mt-3 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>

        {/* Middle Section - Analytics and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Sales Analytics Chart */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 lg:col-span-2 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-deep-navy font-quantico">Sales Analytics</h2>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Revenue
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-1"></div>
                  Orders
                </span>
              </div>
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { name: 'Jan', revenue: 18000, orders: 35 },
                    { name: 'Feb', revenue: 25000, orders: 45 },
                    { name: 'Mar', revenue: 32000, orders: 65 },
                    { name: 'Apr', revenue: 28000, orders: 52 },
                    { name: 'May', revenue: 35000, orders: 75 },
                    { name: 'Jun', revenue: 42000, orders: 85 },
                    { name: 'Jul', revenue: 38000, orders: 78 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0821d2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0821d2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFF', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#0821d2" 
                    fillOpacity={1} 
                    fill="url(#colorOrders)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-deep-navy font-quantico">Top Products</h2>
              <button className="text-xs text-primary-blue font-medium flex items-center">
                View all
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </button>
            </div>

            <div className="space-y-5">
              {dashboardData.topSellingProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <div className="h-14 w-14 bg-gray-200 rounded-md mr-3 overflow-hidden">
                    {product.thumbnail && (
                      <img 
                        src={product.thumbnail} 
                        alt={product.title} 
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-deep-navy">
                      {product.title && product.title.length > 25 ? `${product.title.substring(0, 25)}...` : product.title || 'Product'}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500 font-pt-sans">{product.totalSold || 100} sold</p>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-deep-navy">
                          ₹{formatIndianCurrency(product.price || 0)}
                        </span>
                        {product.discount && (
                          <span className="ml-2 text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">-{product.discount}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders and Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 lg:col-span-2 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-deep-navy font-quantico">Recent Orders</h2>
              <button className="text-xs text-primary-blue font-medium flex items-center">
                View all
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Delivery date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formatRecentOrders().map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded-md mr-3 flex-shrink-0"></div>
                          <span className="text-sm font-medium text-deep-navy">
                            {order.product}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {order.price}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.deliveryDate}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Delivered
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Status Chart */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold text-deep-navy mb-6 font-quantico">Order Status</h2>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Processing', value: dashboardData.orderStatus.processing || 10 },
                      { name: 'Shipped', value: dashboardData.orderStatus.shipped || 25 },
                      { name: 'Delivered', value: dashboardData.orderStatus.delivered || 50 },
                      { name: 'Refunded', value: dashboardData.orderStatus.refunded || 15 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#FCD34D" />
                    <Cell fill="#60A5FA" />
                    <Cell fill="#34D399" />
                    <Cell fill="#F87171" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFF', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem'
                    }}
                    formatter={(value, name) => [`${value} Orders`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
                  </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-300 rounded-full mr-2"></div>
                <span className="text-xs text-gray-600">Processing</span>
                  </div>
                  <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-xs text-gray-600">Shipped</span>
                    </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-gray-600">Delivered</span>
                    </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                <span className="text-xs text-gray-600">Refunded</span>
                  </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - States and Blogs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* States By Sales */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-deep-navy font-quantico">Top States By Sales</h2>
              <button className="text-xs text-primary-blue font-medium flex items-center">
                View report
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </button>
            </div>

            <div className="flex items-center text-xs text-gray-500 mb-3 bg-green-50 px-3 py-2 rounded-lg">
              <div className="mr-2 text-green-600">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span>1.56% increase from {new Date(dashboardData.timeRange?.start || Date.now()).toLocaleDateString('en-IN', {day: 'numeric', month: 'short'})} to {new Date(dashboardData.timeRange?.end || Date.now()).toLocaleDateString('en-IN', {day: 'numeric', month: 'short'})}</span>
            </div>

            <h3 className="text-2xl font-bold text-deep-navy mb-4">
              ₹{formatIndianCurrency(dashboardData.totalRevenue || 0)}
            </h3>
            
            <div className="mb-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.topStates.map(state => ({
                    name: state.code,
                    value: state.amount
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFF', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem'
                    }}
                    formatter={(value) => [`₹${formatIndianCurrency(value)}`, 'Sales']}
                  />
                  <Bar dataKey="value" fill="#0821d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 mt-4">
              {dashboardData.topStates.slice(0, 3).map((state, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-primary-blue/10 text-primary-blue rounded-full mr-3 text-xs flex items-center justify-center font-medium">
                      {state.code}
                    </div>
                    <span className="text-sm font-medium text-deep-navy">{state.name}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`text-${state.growth === 'up' ? 'green' : 'red'}-500 mr-3`}>
                      {state.growth === 'up' ? 
                        <ArrowUpRight className="h-3 w-3" /> : 
                        <ArrowDownRight className="h-3 w-3" />
                      }
                    </div>
                    <span className="text-sm font-bold text-deep-navy">₹{formatIndianCurrency(state.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blog Status */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-deep-navy font-quantico">Content Performance</h2>
              <button className="text-xs text-primary-blue font-medium flex items-center">
                Manage content
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-primary-blue">{dashboardData.blogStatus.published}</h3>
                <p className="text-sm text-gray-600 mt-1">Published Blogs</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-amber-500">{dashboardData.blogStatus.draft}</h3>
                <p className="text-sm text-gray-600 mt-1">Draft Blogs</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-medium text-deep-navy">Blog Traffic</h3>
                <span className="text-xs text-green-600 font-medium">+12.5%</span>
              </div>
              
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: 'Mon', visits: 120 },
                      { name: 'Tue', visits: 180 },
                      { name: 'Wed', visits: 250 },
                      { name: 'Thu', visits: 210 },
                      { name: 'Fri', visits: 290 },
                      { name: 'Sat', visits: 190 },
                      { name: 'Sun', visits: 220 }
                    ]}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFF', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.375rem'
                      }}
                      formatter={(value) => [`${value} visits`, 'Traffic']}
                    />
                    <Line type="monotone" dataKey="visits" stroke="#0821d2" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-md font-medium text-deep-navy">Recent Blogs</h3>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <div className="h-10 w-10 bg-gray-200 rounded-full mr-3 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-deep-navy">
                      {['How to Train Your Dog', 'Best Cat Foods in 2023', 'Pet Care Tips for Summer'][index]}
                    </h4>
                    <div className="flex items-center mt-1">
                      <span className={`inline-block h-2 w-2 rounded-full ${index % 2 === 0 ? 'bg-green-500' : 'bg-amber-500'} mr-1.5`}></span>
                    <p className="text-xs text-gray-500">
                      {index % 2 === 0 ? 'Published • 2 days ago' : 'Draft • 5 days ago'}
                    </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coupon Stats */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-deep-navy font-quantico">Promotions & Coupons</h2>
            <button className="text-xs text-primary-blue font-medium flex items-center">
              Create coupon
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-5 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 mr-3">
                  <span className="text-green-600 text-xl">✓</span>
            </div>
                <div>
                  <h3 className="text-2xl font-bold text-deep-navy">{dashboardData.activeCoupons || 0}</h3>
                  <p className="text-sm text-gray-600 mt-1">Active Coupons</p>
                </div>
              </div>
            </div>
            <div className="p-5 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-red-100 mr-3">
                  <span className="text-red-600 text-xl">×</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-deep-navy">{dashboardData.expiredCoupons || 0}</h3>
                  <p className="text-sm text-gray-600 mt-1">Expired Coupons</p>
                </div>
              </div>
            </div>
            <div className="p-5 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-3">
                  <span className="text-primary-blue text-xl">%</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-deep-navy">{Math.round((dashboardData.totalOrders || 0) * 0.25)}</h3>
                  <p className="text-sm text-gray-600 mt-1">Orders with Coupons</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-md font-medium text-deep-navy">Top Used Coupons</h3>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
            {(dashboardData.coupons || []).slice(0, 3).map((coupon, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-bold text-deep-navy">{coupon.code || `SALE${index + 1}0OFF`}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-deep-navy">
                          {coupon.discountType === 'percentage' 
                            ? `${coupon.discount}% OFF` 
                            : `₹${formatIndianCurrency(coupon.discount)} OFF`}
                </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        Used {coupon.usedCount || (index + 1) * 25} times
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {coupon.isActive ? 'Active' : 'Expired'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
