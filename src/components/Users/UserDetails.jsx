// src/components/Users/UserDetails.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Button from '../Common/Button';
import { FaShoppingCart, FaSignInAlt, FaClock, FaComments, FaStore, FaHeart, FaEye, FaCalendarCheck } from 'react-icons/fa';

const UserDetails = ({ user, metrics, onEdit, onDeactivate, onResetPassword }) => {
  if (!user) return null;

  // Helper function to render a metric card with label, value, and description
  const renderMetricCard = (icon, label, value, description) => (
    <motion.div 
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-xl p-4 shadow-md"
    >
      <div className="flex items-start">
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-lg mr-4">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h4 className="text-xl font-bold text-gray-800">{value}</h4>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </motion.div>
  );

  // Get metric icons based on category
  const getMetricIcon = (category, key) => {
    if (category === 'shopping') {
      if (key.toLowerCase().includes('purchase')) return <FaShoppingCart className="h-5 w-5 text-purple-600" />;
      if (key.toLowerCase().includes('cart')) return <FaStore className="h-5 w-5 text-purple-600" />;
      return <FaStore className="h-5 w-5 text-purple-600" />;
    }
    if (category === 'engagement') {
      if (key.toLowerCase().includes('login')) return <FaSignInAlt className="h-5 w-5 text-purple-600" />;
      if (key.toLowerCase().includes('visit')) return <FaEye className="h-5 w-5 text-purple-600" />;
      return <FaHeart className="h-5 w-5 text-purple-600" />;
    }
    if (category === 'recency') {
      return <FaClock className="h-5 w-5 text-purple-600" />;
    }
    if (category === 'interaction') {
      if (key.toLowerCase().includes('comment')) return <FaComments className="h-5 w-5 text-purple-600" />;
      return <FaCalendarCheck className="h-5 w-5 text-purple-600" />;
    }
    return <FaEye className="h-5 w-5 text-purple-600" />;
  };

  // Helper function to check if a metrics category has any data
  const hasMetricsInCategory = (category) => {
    return metrics[category] && Object.keys(metrics[category]).length > 0;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-xl overflow-hidden"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative">
              <div className="h-20 w-20 rounded-full flex items-center justify-center overflow-hidden bg-purple-300">
                {(user.avatar || user.profilePicture) ? (
                  <img 
                    src={user.profilePicture || user.avatar} 
                    alt={typeof user.name === 'object' ? (user.name.name || 'User') : user.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      console.log("Image failed to load:", e.target.src);
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentNode.classList.add('bg-purple-300');
                      e.target.parentNode.innerHTML = `<span class="text-white text-3xl font-bold">${
                        typeof user.name === 'object' 
                          ? (user.name.name ? user.name.name.charAt(0).toUpperCase() : 'U') 
                          : (user.name ? user.name.charAt(0).toUpperCase() : 'U')
                      }</span>`;
                    }}
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {typeof user.name === 'object' 
                      ? (user.name.name ? user.name.name.charAt(0).toUpperCase() : 'U') 
                      : (user.name ? user.name.charAt(0).toUpperCase() : 'U')}
                  </span>
                )}
              </div>
              <div className={`absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-white">
                {typeof user.name === 'object' ? (user.name.name || 'User') : user.name}
              </h2>
              <p className="text-purple-200 flex items-center">
                <span className="inline-block mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <Button 
              onClick={onEdit} 
              className="bg-white text-purple-800 hover:bg-purple-100 transition-colors flex items-center px-4 py-2 rounded-lg shadow-md min-w-[100px] justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
              </svg>
              <span>Edit</span>
            </Button>
            <Button 
              onClick={onDeactivate} 
              className={`${user.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors flex items-center px-4 py-2 rounded-lg shadow-md min-w-[120px] justify-center`}
            >
              {user.isActive ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Deactivate</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Activate</span>
                </>
              )}
            </Button>
            <Button 
              onClick={onResetPassword} 
              className="bg-yellow-500 hover:bg-yellow-600 text-white transition-colors flex items-center px-4 py-2 rounded-lg shadow-md min-w-[150px] justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Reset Password</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* User details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Profile Information</h3>
            <div className="space-y-3">
              <p className="text-gray-700 flex items-start">
                <span className="text-gray-500 inline-block w-24">User ID:</span>
                <span className="font-medium truncate">{user._id}</span>
              </p>
              <p className="text-gray-700 flex items-start">
                <span className="text-gray-500 inline-block w-24">Role:</span>
                <span className="font-medium">{user.role}</span>
              </p>
              <p className="text-gray-700 flex items-start">
                <span className="text-gray-500 inline-block w-24">Status:</span>
                <span className={`font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </p>
              <p className="text-gray-700 flex items-start">
                <span className="text-gray-500 inline-block w-24">Created:</span>
                <span className="font-medium">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </p>
              <p className="text-gray-700 flex items-start">
                <span className="text-gray-500 inline-block w-24">Last Login:</span>
                <span className="font-medium">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never'}</span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Contact Information</h3>
            <div className="space-y-3">
              <p className="text-gray-700 flex items-start">
                <span className="text-gray-500 inline-block w-24">Email:</span>
                <span className="font-medium">{user.email}</span>
              </p>
              <p className="text-gray-700 flex items-start">
                <span className="text-gray-500 inline-block w-24">Phone:</span>
                <span className="font-medium">{user.phone || 'Not provided'}</span>
              </p>
              <p className="text-gray-700 flex items-start">
                <span className="text-gray-500 inline-block w-24">Address:</span>
                <span className="font-medium">{user.address || 'Not provided'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            User Activity Metrics
          </h3>

          {/* Check if there are any metrics or if there's an error status */}
          {(
            metrics._status || // If there's a status message/error
            ( // Or if all metric categories are empty
              Object.entries(metrics).filter(([key]) => key !== '_status').every(
                ([_, category]) => !category || Object.keys(category).length === 0
              )
            )
          ) ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              {metrics._status?.error ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 4a8 8 0 100 16 8 8 0 000-16z" />
                  </svg>
                  <p className="text-red-500 font-medium">{metrics._status.message || "Error loading metrics"}</p>
                  <p className="text-gray-500 text-sm mt-2">Some required modules may be missing on the server.</p>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-600">{metrics._status?.message || "No metrics available for this user yet."}</p>
                  <p className="text-gray-500 text-sm mt-2">This user hasn't performed any trackable actions yet, or the required models (Orders, Reviews, etc.) aren't available.</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Main metrics categories in a 2-column grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shopping Behavior Metrics */}
                {hasMetricsInCategory('shopping') && (
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-5 shadow-sm">
                    <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                      <FaShoppingCart className="mr-2 text-purple-600" /> 
                      <span>Shopping Behavior</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(metrics.shopping).map(([key, metric]) => (
                        <motion.div 
                          key={key}
                          whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                          className="bg-white rounded-lg p-4 shadow-sm transition-all duration-300"
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-100 p-2 rounded-lg">
                              {getMetricIcon('shopping', key)}
                            </div>
                            <div className="ml-3">
                              <p className="text-xs text-gray-500">{metric.label || key}</p>
                              <p className="text-xl font-bold text-gray-800">{metric.value !== undefined ? metric.value : "N/A"}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{metric.description || ""}</p>
                        </motion.div>
                      ))}
        </div>
      </div>
                )}
                
                {/* Engagement Metrics */}
                {hasMetricsInCategory('engagement') && (
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-5 shadow-sm">
                    <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                      <FaHeart className="mr-2 text-indigo-600" /> 
                      <span>Engagement</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(metrics.engagement).map(([key, metric]) => (
                        <motion.div 
                          key={key}
                          whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                          className="bg-white rounded-lg p-4 shadow-sm transition-all duration-300"
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-lg">
                              {getMetricIcon('engagement', key)}
                            </div>
                            <div className="ml-3">
                              <p className="text-xs text-gray-500">{metric.label || key}</p>
                              <p className="text-xl font-bold text-gray-800">{metric.value !== undefined ? metric.value : "N/A"}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{metric.description || ""}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Secondary metrics categories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recency Metrics */}
                {hasMetricsInCategory('recency') && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm">
                    <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                      <FaClock className="mr-2 text-blue-600" /> 
                      <span>Recency</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(metrics.recency).map(([key, metric]) => (
                        <motion.div 
                          key={key}
                          whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                          className="bg-white rounded-lg p-4 shadow-sm transition-all duration-300"
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                              {getMetricIcon('recency', key)}
                            </div>
                            <div className="ml-3">
                              <p className="text-xs text-gray-500">{metric.label || key}</p>
                              <p className="text-xl font-bold text-gray-800">{metric.value !== undefined ? metric.value : "N/A"}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{metric.description || ""}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Interaction Metrics */}
                {hasMetricsInCategory('interaction') && (
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 shadow-sm">
                    <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                      <FaComments className="mr-2 text-green-600" /> 
                      <span>Interactions</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(metrics.interaction).map(([key, metric]) => (
                        <motion.div 
                          key={key}
                          whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                          className="bg-white rounded-lg p-4 shadow-sm transition-all duration-300"
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 p-2 rounded-lg">
                              {getMetricIcon('interaction', key)}
                            </div>
                            <div className="ml-3">
                              <p className="text-xs text-gray-500">{metric.label || key}</p>
                              <p className="text-xl font-bold text-gray-800">{metric.value !== undefined ? metric.value : "N/A"}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{metric.description || ""}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

UserDetails.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
    lastLogin: PropTypes.string,
    avatar: PropTypes.string,
    profilePicture: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string
  }),
  metrics: PropTypes.shape({
    shopping: PropTypes.object,
    engagement: PropTypes.object,
    recency: PropTypes.object,
    interaction: PropTypes.object
  }),
  onEdit: PropTypes.func.isRequired,
  onDeactivate: PropTypes.func.isRequired,
  onResetPassword: PropTypes.func.isRequired
};

UserDetails.defaultProps = {
  metrics: {
    shopping: {},
    engagement: {},
    recency: {},
    interaction: {}
  }
};

export default UserDetails;
