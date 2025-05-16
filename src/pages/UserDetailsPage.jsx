// src/pages/UserDetailsPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserDetails from '../components/Users/UserDetails';
import useUsers from '../hooks/useUsers';
import toast from 'react-hot-toast';
import Button from '../components/Common/Button';
import ResetPasswordModal from '../components/Modals/ResetPasswordModal';
import { motion } from 'framer-motion';
import logger from '../utils/logger';

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getUserById,
    changeUserStatus,
    resetUserPassword,
    getUserActivity,
    getUserAuditLogs,
    getUserMetrics,
  } = useUsers();
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [metrics, setMetrics] = useState({
    shopping: {},
    engagement: {},
    recency: {},
    interaction: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!id) {
          throw new Error('User ID is missing.');
        }
        
        // Fetch user details
        try {
        const fetchedUser = await getUserById(id);
        if (fetchedUser) {
            logger.debug("User data loaded successfully", fetchedUser);
          setUser(fetchedUser);
        } else {
          throw new Error('User data is unavailable.');
          }
        } catch (userError) {
          logger.error("Failed to load user data:", userError);
          setError(userError.message || 'Error fetching user data.');
          toast.error(`Error fetching user data: ${userError.message || userError}`);
          throw userError; // Re-throw to exit the main function
        }

        // Fetch user activity data with enhanced error handling
        let activityData = [];
        try {
        const userActivity = await getUserActivity(id);
          // Verify the data structure
          if (Array.isArray(userActivity)) {
            activityData = userActivity;
          } else if (userActivity && Array.isArray(userActivity.activities)) {
            activityData = userActivity.activities;
          } else if (userActivity && userActivity.data && Array.isArray(userActivity.data)) {
            activityData = userActivity.data;
          }
          setActivity(activityData);
          logger.debug("Activity data loaded", { count: activityData.length });
        } catch (actError) {
          logger.error("Failed to load user activity:", actError);
          // Don't display toast here, continue loading other data
          console.error("Activity error:", actError);
        }

        // Fetch user audit logs with enhanced error handling
        let auditLogsData = [];
        try {
        const userAuditLogs = await getUserAuditLogs(id);
          // Verify the data structure
          if (Array.isArray(userAuditLogs)) {
            auditLogsData = userAuditLogs;
          } else if (userAuditLogs && Array.isArray(userAuditLogs.auditLogs)) {
            auditLogsData = userAuditLogs.auditLogs;
          } else if (userAuditLogs && userAuditLogs.data && Array.isArray(userAuditLogs.data)) {
            auditLogsData = userAuditLogs.data;
          }
          setAuditLogs(auditLogsData);
          logger.debug("Audit logs loaded", { count: auditLogsData.length });
        } catch (auditError) {
          logger.error("Failed to load audit logs:", auditError);
          // Set an empty array but don't display toast
          console.error("Audit logs error:", auditError);
        }

        // Get user metrics with better error handling and data structure verification
        try {
          const userMetrics = await getUserMetrics(id);
          logger.debug("Raw metrics data:", userMetrics);
          
          // Initialize the full metrics structure to ensure all categories are available
          const processedMetrics = {
            shopping: {},
            engagement: {},
            recency: {},
            interaction: {}
          };
          
          // Check if we received an error status directly from context
          if (userMetrics && userMetrics._status && userMetrics._status.error) {
            logger.warn("Received error status in metrics response", userMetrics._status);
            processedMetrics._status = userMetrics._status;
            setMetrics(processedMetrics);
          }
          // Check if we have the new structure with categories
          else if (userMetrics && typeof userMetrics === 'object') {
            // Handle new categorized format
            if (userMetrics.shopping || userMetrics.engagement || 
                userMetrics.recency || userMetrics.interaction) {
              
              // Merge the received metrics with our empty structure
              processedMetrics.shopping = userMetrics.shopping || {};
              processedMetrics.engagement = userMetrics.engagement || {};
              processedMetrics.recency = userMetrics.recency || {};
              processedMetrics.interaction = userMetrics.interaction || {};
              
              logger.debug("Using new categorized metrics format");
            } 
            // Handle legacy format (flat structure)
            else if (Object.keys(userMetrics).length > 0) {
              logger.debug("Converting legacy metrics format to categorized format");
              
              // Common metrics and their mappings to categories
              const metricMappings = {
                productPurchasedCount: ['shopping', 'productsPurchased', 'Products Purchased', 'Total number of products this user has purchased'],
                ordersPlaced: ['shopping', 'ordersPlaced', 'Orders Placed', 'Total number of orders this user has placed'],
                totalSpent: ['shopping', 'totalSpent', 'Total Spent', 'Total amount of money this user has spent on purchases'],
                loginFrequency: ['engagement', 'loginCount', 'Login Count', 'Number of times this user has logged into their account'],
                daysSinceLastLogin: ['recency', 'daysSinceLastLogin', 'Days Since Last Login', 'Number of days since this user last logged in'],
                reviewsSubmitted: ['interaction', 'reviewsSubmitted', 'Reviews Submitted', 'Number of product reviews this user has submitted']
              };
              
              // Process each metric according to its mapping
              Object.keys(userMetrics).forEach(key => {
                if (metricMappings[key]) {
                  const [category, metricKey, label, description] = metricMappings[key];
                  processedMetrics[category][metricKey] = {
                    value: userMetrics[key],
                    label: label,
                    description: description
                  };
                } else {
                  // For unknown metrics, place in the engagement category as a fallback
                  processedMetrics.engagement[key] = {
                    value: userMetrics[key],
                    label: key.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to Title Case
                    description: `Value of ${key} metric for this user`
                  };
                }
              });
            } else {
              // Empty metrics
              logger.debug("No metrics data available");
              processedMetrics._status = {
                message: "No metrics data is available for this user"
              };
            }
          } else {
            // Invalid metrics format
            logger.warn("Invalid metrics data format", userMetrics);
            processedMetrics._status = {
              message: "Invalid metrics data received from the server"
            };
          }
          
          setMetrics(processedMetrics);
        } catch (metricsError) {
          // Handle metrics loading error without disrupting other data
          logger.error("Failed to load user metrics:", metricsError);
          console.error("Metrics error:", metricsError);
          
          // Keep the structure but indicate error
          setMetrics({
            shopping: {},
            engagement: {},
            recency: {},
            interaction: {},
            _status: {
              error: true,
              message: "Failed to load metrics"
            }
          });
        }
      } catch (err) {
        // This catches any error that was re-thrown from the individual sections
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, getUserById, getUserActivity, getUserAuditLogs, getUserMetrics]);

  const handleEdit = () => {
    navigate(`/users/edit/${id}`);
  };

  const handleDeactivate = async () => {
    try {
      await changeUserStatus(id, !user.isActive);
      setUser({ ...user, isActive: !user.isActive });
      toast.success(`User has been ${user.isActive ? 'deactivated' : 'activated'} successfully.`);
    } catch (err) {
      toast.error(`Failed to change user status: ${err}`);
    }
  };

  const handleOpenResetPasswordModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseResetPasswordModal = () => {
    setIsModalOpen(false);
  };

  const handleResetPassword = async (newPassword) => {
    try {
      await resetUserPassword(id, newPassword);
      toast.success('Password has been reset successfully.');
      handleCloseResetPasswordModal();
    } catch (err) {
      toast.error(`Failed to reset password: ${err}`);
    }
  };

  const processActivityData = (activityData) => {
    if (!Array.isArray(activityData) || activityData.length === 0) {
      return [];
    }
    
    return activityData.map(act => {
      let description = 'Unknown activity';
      const action = act.action ? act.action.toUpperCase() : '';
      
      switch(action) {
        case 'LOGIN':
          description = `User logged in${act.ip ? ` from ${act.ip}` : ''}`;
          break;
        case 'UPDATE':
          description = act.details 
            ? `Profile updated: ${Object.keys(act.details).join(', ')}`
            : 'Profile was updated';
          break;
        case 'CREATE':
          description = 'Account was created';
          break;
        case 'DELETE':
          description = 'Account was deleted';
          break;
        case 'RESTORE':
          description = 'Account was restored';
          break;
        case 'PASSWORD_RESET':
          description = 'Password was reset';
          break;
        case 'LOGOUT':
          description = 'User logged out';
          break;
        default:
          if (act.details) {
            description = `${action}: ${JSON.stringify(act.details)}`;
          } else if (act.description) {
            description = act.description;
          }
      }
      
      return {
        ...act,
        description,
        date: act.createdAt || act.timestamp || act.date || new Date()
      };
    });
  };

  const processedActivity = processActivityData(activity);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="pulse-animation">
        <div className="h-12 w-12 rounded-full border-4 border-t-[#A467F7] border-r-transparent border-b-[#4C03CB] border-l-transparent animate-spin"></div>
      </div>
      <p className="ml-4 text-xl text-gray-700 quantico-regular">Loading user details...</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-red-500 text-xl mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-center text-xl quantico-regular">{error}</p>
      <Button onClick={() => navigate(-1)} className="mt-6 bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg">
        Back to Users
      </Button>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <p className="text-center text-2xl mb-6 text-gray-700 quantico-regular">User not found.</p>
      <Button onClick={() => navigate(-1)} className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg">
        Back to Users
      </Button>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 bg-gray-50 min-h-screen"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <Button 
          onClick={() => navigate(-1)} 
          className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg flex items-center gap-2 transition-all duration-300 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Users
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
      <UserDetails
        user={user}
        metrics={metrics}
        onEdit={handleEdit}
        onDeactivate={handleDeactivate}
        onResetPassword={handleOpenResetPasswordModal}
      />
      </motion.div>

      <motion.div 
        variants={containerVariants}
        className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Recent Activity */}
        <motion.div 
          variants={itemVariants}
          className="bg-white shadow-xl rounded-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] px-6 py-4">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Activity
            </h3>
          </div>
          <div className="p-6 max-h-80 overflow-y-auto">
            {processedActivity.length === 0 ? (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500">No recent activity recorded.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {processedActivity.map((act, index) => (
                  <li key={index} className="bg-gray-50 rounded-lg p-3 flex items-start">
                    <div className="h-2 w-2 rounded-full bg-purple-500 mt-2 mr-3"></div>
                    <div>
                      <p className="text-gray-700">{act.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(act.date).toLocaleString()}
                      </p>
                    </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        </motion.div>

        {/* Audit Logs */}
        <motion.div 
          variants={itemVariants}
          className="bg-white shadow-xl rounded-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] px-6 py-4">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Audit Logs
            </h3>
          </div>
          <div className="p-6 max-h-80 overflow-y-auto">
          {auditLogs.length === 0 ? (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">No audit logs available.</p>
              </div>
            ) : (
              <ul className="space-y-3">
              {auditLogs.map((log, index) => (
                  <li key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-800 font-medium">
                          {log.action} {log.details && `- ${log.details}`}
                        </p>
                        {log.changes && Object.keys(log.changes).length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">Changes:</p>
                            <ul className="text-xs text-gray-600 mt-1 ml-4 list-disc">
                              {Object.entries(log.changes).map(([key, value], i) => (
                                <li key={i}>
                                  <span className="font-medium">{key}:</span> {value.toString()}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        </motion.div>
      </motion.div>

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isModalOpen}
        onClose={handleCloseResetPasswordModal}
        onSubmit={handleResetPassword}
        userName={user?.name || 'User'}
      />
    </motion.div>
  );
};

export default UserDetailsPage;
