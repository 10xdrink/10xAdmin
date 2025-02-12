// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useUsers } from '../contexts/UserContext'; // Corrected import path
import toast from 'react-hot-toast';
import { Card, Grid, Typography, CircularProgress, Button } from '@mui/material';
import OrderMetrics from '../components/Orders/OrderMetrics'; // Importing OrderMetrics component

const Dashboard = () => {
  const { countUsersByRole, getTotalUserCount, exportUsers } = useUsers(); // Ensure exportUsers is included
  const [totalUsers, setTotalUsers] = useState(0);
  const [roleCounts, setRoleCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total number of users
        const total = await getTotalUserCount();
        setTotalUsers(total || 0);

        // Fetch user counts by role
        const countsData = await countUsersByRole();
        // Transform countsData to an object with role as key and count as value
        const counts = {};
        countsData.forEach(item => {
          counts[item.role] = item.count;
        });
        setRoleCounts(counts || {});
      } catch (error) {
        // Handle errors and provide feedback
        const errorMessage = error?.message || 'An unexpected error occurred.';
        toast.error(`Error fetching dashboard data: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [countUsersByRole, getTotalUserCount]);

  // Prepare chart data with defensive checks
  const chartData = {
    labels: roleCounts && typeof roleCounts === 'object' ? Object.keys(roleCounts) : [],
    datasets: [
      {
        label: 'Number of Users',
        data: roleCounts && typeof roleCounts === 'object' ? Object.values(roleCounts) : [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue color
      },
    ],
  };

  /**
   * Handler for exporting users
   */
  const handleExport = () => {
    exportUsers('csv'); // You can change the format if needed
  };

  return (
    <div className="p-6">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Button
        onClick={handleExport}
        variant="contained"
        color="primary"
        className="mb-6"
        disabled={loading}
      >
        {loading ? 'Exporting...' : 'Export Users'}
      </Button>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Grid container spacing={3}>
            {/* Total Users Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card style={{ padding: '20px' }}>
                <Typography variant="h6">Total Users</Typography>
                <Typography variant="h4">{totalUsers}</Typography>
              </Card>
            </Grid>

            {/* Users by Role Chart */}
            <Grid item xs={12} sm={6} md={3}>
              <Card style={{ padding: '20px' }}>
                <Typography variant="h6">Users by Role</Typography>
                {chartData.labels.length > 0 ? (
                  <Bar data={chartData} />
                ) : (
                  <Typography variant="body1">No data available.</Typography>
                )}
              </Card>
            </Grid>

            {/* Additional User Metrics Cards can be added here */}
          </Grid>

          {/* Divider or Spacer */}
          <div style={{ margin: '40px 0' }} />

          {/* Order Metrics Section */}
          <OrderMetrics />
        </>
      )}
    </div>
  );
};

export default Dashboard;
