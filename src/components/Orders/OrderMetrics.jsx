// src/components/Orders/OrderMetrics.jsx

import React, { useEffect, useState } from 'react';
import orderService from '../../api/orderService';
import { useAuth } from '../../contexts/AuthContext';
import {
  Card,
  Grid,
  Typography,
  CircularProgress,
  Box,
  TextField,
  useTheme,
  Stack,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from 'recharts';
import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import { alpha } from '@mui/system';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'; // Import Framer Motion

// Define a color palette for charts
const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4'];

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label, title, unit }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        sx={{
          p: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontFamily: 'Poppins, Arial', fontWeight: 600, color: '#000' }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontFamily: 'Poppins, Arial', color: '#555' }}
        >
          {label}: {unit ? `${payload[0].value}${unit}` : payload[0].value}
        </Typography>
      </Paper>
    );
  }

  return null;
};

export default function OrderMetrics() {
  const { token } = useAuth();
  const theme = useTheme();

  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)) // 30 days ago
  );
  const [endDate, setEndDate] = useState(new Date());

  // Sorting states
  const [topProductsSort, setTopProductsSort] = useState('desc'); // 'desc' or 'asc'
  const [orderTypesSort, setOrderTypesSort] = useState('desc'); // 'desc' or 'asc'
  const [revenueSortOrder, setRevenueSortOrder] = useState('asc'); // 'asc' or 'desc'

  const fetchMetrics = async () => {
    setLoading(true);
    setError(false);
    try {
      const params = {
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString(),
      };
      const data = await orderService.getOrderMetrics(params, token);
      // Ensure that revenueOverTime is an array of objects with 'date' and 'grossRevenue'
      const processedData = data.data.revenueOverTime
        .map((item) => ({
          date: item.date,
          grossRevenue: Number(item.grossRevenue),
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Initial sort by date ascending
      setMetrics({ ...data.data, revenueOverTime: processedData });
    } catch (err) {
      setError(true);
      toast.error(err.message || 'Failed to fetch order metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const handleCardClick = (metricName) => {
    toast(`Clicked on ${metricName}`);
    // Implement navigation or detailed view logic here
  };

  // Sorting handlers
  const handleTopProductsSortChange = (event) => {
    setTopProductsSort(event.target.value);
  };

  const handleOrderTypesSortChange = (event) => {
    setOrderTypesSort(event.target.value);
  };

  const handleRevenueSortOrderChange = (event) => {
    setRevenueSortOrder(event.target.value);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 6, fontFamily: 'Poppins, Arial' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !metrics) {
    return (
      <Box sx={{ textAlign: 'center', py: 6, fontFamily: 'Poppins, Arial' }}>
        <Typography variant="h6" color="error">
          Failed to load metrics.
        </Typography>
      </Box>
    );
  }

  // Destructure the metrics with default values to prevent undefined errors
  const {
    totalOrders = 0,
    repeatOrders = 0,
    newOrders = 0,
    abandonedOrders = 0,
    grossRevenue = 0,
    netRevenue = 0,
    averageOrderValue = 0,
    onTimeDeliveryRate = 0,
    averageProcessingTime = 0,
    orderAccuracyRate = 100,
    orderFrequencyRate = 0,
    repeatPurchaseRate = 0,
    orderAbandonmentRate = 0,
    averageShippingCostPerOrder = 0,
    ordersWithFreeShipping = 0,
    topSellingProducts = [],
    revenueOverTime = [],
    costPerOrder = 0,
    processingOrders = 0,
    shippedOrders = 0,
    deliveredOrders = 0,
    refundedOrders = 0,
    averageCSAT = 0,
    averageNPS = 0,
  } = metrics;

  // Aggregate data for Pie Chart (e.g., Order Types)
  let orderTypesData = [
    { name: 'New Orders', value: newOrders },
    { name: 'Repeat Orders', value: repeatOrders },
    { name: 'Abandoned Orders', value: abandonedOrders },
  ];

  // Apply sorting to Order Types Data
  if (orderTypesSort === 'asc') {
    orderTypesData = orderTypesData.sort((a, b) => a.value - b.value);
  } else {
    orderTypesData = orderTypesData.sort((a, b) => b.value - a.value);
  }

  // Aggregate data for Order Status Donut Chart
  const orderStatusData = [
    { name: 'Processing', value: processingOrders },
    { name: 'Shipped', value: shippedOrders },
    { name: 'Delivered', value: deliveredOrders },
    { name: 'Refunded', value: refundedOrders },
  ];

  // Aggregate data for Radar Chart (Performance Metrics)
  const performanceData = [
    { metric: 'Accuracy', value: orderAccuracyRate },
    { metric: 'Frequency', value: orderFrequencyRate },
    { metric: 'CSAT', value: averageCSAT },
    { metric: 'NPS', value: averageNPS },
    { metric: 'Delivery', value: onTimeDeliveryRate },
  ];

  // Sort Top Selling Products based on selected sort order
  let sortedTopSellingProducts = [...topSellingProducts];
  if (topProductsSort === 'asc') {
    sortedTopSellingProducts = sortedTopSellingProducts.sort((a, b) =>
      a.totalSold - b.totalSold
    );
  } else {
    sortedTopSellingProducts = sortedTopSellingProducts.sort((a, b) =>
      b.totalSold - a.totalSold
    );
  }

  // Apply sorting to Revenue Over Time Data
  let sortedRevenueOverTime = [...revenueOverTime];
  if (revenueSortOrder === 'asc') {
    sortedRevenueOverTime = sortedRevenueOverTime.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    sortedRevenueOverTime = sortedRevenueOverTime.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4 },
        py: 4,
        backgroundColor: theme.palette.background.default,
        fontFamily: 'Poppins, Arial',
      }}
    >
      {/* Title & Subheader */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box mb={4}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}
          >
            Order Metrics
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Track key performance indicators of your store and see how they change over time.
          </Typography>
        </Box>
      </motion.div>

      {/* Date Range Picker */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Box mb={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Box>
      </motion.div>

      {/* Summary Metrics Row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <Grid container spacing={3}>
          {/* Total Orders */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                elevation={3}
                onClick={() => handleCardClick('Total Orders')}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <ShoppingCartIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                    >
                      {totalOrders}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </motion.div>
          </Grid>

          {/* Gross Revenue */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                elevation={3}
                onClick={() => handleCardClick('Gross Revenue')}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.success.main, 0.05),
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <MonetizationOnIcon color="success" fontSize="large" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Gross Revenue
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                    >
                      ${grossRevenue.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </motion.div>
          </Grid>

          {/* Average Order Value */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                elevation={3}
                onClick={() => handleCardClick('Avg Order Value')}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.warning.main, 0.05),
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <AttachMoneyIcon color="warning" fontSize="large" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Avg Order Value
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                    >
                      ${averageOrderValue.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </motion.div>
          </Grid>

          {/* Order Abandonment Rate */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                elevation={3}
                onClick={() => handleCardClick('Order Abandonment Rate')}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.error.main, 0.05),
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <WarningIcon color="error" fontSize="large" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Order Abandonment Rate
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                    >
                      {orderAbandonmentRate.toFixed(2)}%
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Gross Revenue Over Time (Line Chart) */}
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <FormControl variant="outlined" size="small">
                <InputLabel id="revenue-sort-order-label">Sort Order</InputLabel>
                <Select
                  labelId="revenue-sort-order-label"
                  value={revenueSortOrder}
                  onChange={handleRevenueSortOrderChange}
                  label="Sort Order"
                >
                  <MenuItem value="asc">Date Ascending</MenuItem>
                  <MenuItem value="desc">Date Descending</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  height: '100%',
                  cursor: 'pointer',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}
                >
                  Gross Revenue Over Time
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                  Track how your revenue has evolved over the selected period.
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sortedRevenueOverTime}>
                    <defs>
                      <linearGradient id="colorGrossRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={theme.palette.primary.main}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={theme.palette.primary.main}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fontFamily: 'Poppins, Arial' }}
                      stroke={theme.palette.text.secondary}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fontFamily: 'Poppins, Arial' }}
                      stroke={theme.palette.text.secondary}
                      tickFormatter={(value) => `$${(value / 1000).toLocaleString()}k`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={<CustomTooltip title="Gross Revenue" unit="$" />}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      type="monotone"
                      dataKey="grossRevenue"
                      name="Gross Revenue"
                      stroke={theme.palette.primary.main}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </Grid>

          {/* Top-Selling Products (Bar Chart) */}
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  height: '100%',
                  cursor: 'pointer',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    Top-Selling Products
                  </Typography>
                  <FormControl variant="outlined" size="small">
                    <InputLabel id="top-products-sort-label">Sort By</InputLabel>
                    <Select
                      labelId="top-products-sort-label"
                      value={topProductsSort}
                      onChange={handleTopProductsSortChange}
                      label="Sort By"
                    >
                      <MenuItem value="desc">Units Sold (Descending)</MenuItem>
                      <MenuItem value="asc">Units Sold (Ascending)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                  The products that have generated the highest sales volume.
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={sortedTopSellingProducts}
                    margin={{ top: 20, right: 20, left: 0, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                    <XAxis
                      dataKey="title"
                      tick={{ fontSize: 12, fontFamily: 'Poppins, Arial' }}
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      height={60}
                      stroke={theme.palette.text.secondary}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fontFamily: 'Poppins, Arial' }}
                      stroke={theme.palette.text.secondary}
                      tickFormatter={(value) => `${value}`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={<CustomTooltip title="Units Sold" unit="" />}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Bar
                      dataKey="totalSold"
                      name="Units Sold"
                      fill={theme.palette.success.main}
                      isAnimationActive={true}
                      animationDuration={1200}
                      animationEasing="ease-in-out"
                      radius={[4, 4, 0, 0]}
                    >
                      {sortedTopSellingProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </Grid>

          {/* Radar Chart for Performance Metrics */}
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  height: '100%',
                  cursor: 'pointer',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}
                >
                  Performance Metrics
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={performanceData}>
                    <PolarGrid />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fontSize: 12, fontFamily: 'Poppins, Arial' }}
                      stroke={theme.palette.text.secondary}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fontSize: 12, fontFamily: 'Poppins, Arial' }}
                      stroke={theme.palette.text.secondary}
                    />
                    <Radar
                      name="Metrics"
                      dataKey="value"
                      stroke={theme.palette.primary.main}
                      fill={alpha(theme.palette.primary.main, 0.6)}
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </Grid>

          {/* Order Status Distribution (Donut Chart) */}
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  height: '100%',
                  cursor: 'pointer',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}
                >
                  Order Status Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      label
                      stroke={theme.palette.background.paper}
                      strokeWidth={2}
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<CustomTooltip title="Order Status" unit="" />}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </Grid>

          {/* Area Chart for Revenue Trend */}
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  height: '100%',
                  cursor: 'pointer',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}
                >
                  Revenue Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sortedRevenueOverTime}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={theme.palette.primary.main}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={theme.palette.primary.main}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fontFamily: 'Poppins, Arial' }}
                      stroke={theme.palette.text.secondary}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fontFamily: 'Poppins, Arial' }}
                      stroke={theme.palette.text.secondary}
                      tickFormatter={(value) => `$${(value / 1000).toLocaleString()}k`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={<CustomTooltip title="Revenue" unit="$" />}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                      type="monotone"
                      dataKey="grossRevenue"
                      name="Gross Revenue"
                      stroke={theme.palette.primary.main}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Additional Metrics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Net Revenue */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                elevation={3}
                onClick={() => handleCardClick('Net Revenue')}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <AttachMoneyIcon color="info" fontSize="large" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Net Revenue
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                    >
                      ${netRevenue.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </motion.div>
          </Grid>

          {/* On-Time Delivery Rate */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                elevation={3}
                onClick={() => handleCardClick('On-Time Delivery Rate')}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <TrendingUpIcon color="secondary" fontSize="large" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      On-Time Delivery Rate
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                    >
                      {onTimeDeliveryRate.toFixed(2)}%
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </motion.div>
          </Grid>

          {/* Repeat Purchase Rate */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                elevation={3}
                onClick={() => handleCardClick('Repeat Purchase Rate')}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.warning.main, 0.05),
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <MonetizationOnIcon color="warning" fontSize="large" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Repeat Purchase Rate
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                    >
                      {repeatPurchaseRate.toFixed(2)}%
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </motion.div>
          </Grid>

          {/* Cost Per Order */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                elevation={3}
                onClick={() => handleCardClick('Cost Per Order')}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.error.main, 0.05),
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <AttachMoneyIcon color="error" fontSize="large" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Cost Per Order
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                    >
                      ${costPerOrder.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}
