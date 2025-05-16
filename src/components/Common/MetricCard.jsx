import React from 'react';
import { 
  FiUsers, 
  FiUserCheck, 
  FiUserX, 
  FiUserPlus, 
  FiRepeat,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiPackage
} from 'react-icons/fi';

/**
 * MetricCard Component
 * 
 * A reusable card component for displaying metrics in a visually appealing way.
 * 
 * @param {string} title - The title of the metric
 * @param {string|number} value - The value to display
 * @param {boolean} isLoading - Loading state
 * @param {string} iconType - Type of icon to display (users, active, inactive, new, returning, orders, revenue, average, pending, processing)
 * @param {number} trend - Percentage trend (positive or negative)
 * @param {string} trendLabel - Label for the trend (optional)
 * @param {string} className - Additional CSS classes
 */
const MetricCard = ({ 
  title, 
  value, 
  isLoading = false, 
  iconType = 'users',
  trend,
  trendLabel = 'vs. last month',
  className = ''
}) => {
  const getIcon = () => {
    switch(iconType) {
      case 'users':
        return <FiUsers className="h-8 w-8 text-blue-600" />;
      case 'active':
        return <FiUserCheck className="h-8 w-8 text-green-600" />;
      case 'inactive':
        return <FiUserX className="h-8 w-8 text-red-600" />;
      case 'new':
        return <FiUserPlus className="h-8 w-8 text-purple-600" />;
      case 'returning':
        return <FiRepeat className="h-8 w-8 text-cyan-600" />;
      case 'orders':
        return <FiShoppingCart className="h-8 w-8 text-blue-600" />;
      case 'revenue':
        return <FiDollarSign className="h-8 w-8 text-green-600" />;
      case 'average':
        return <FiTrendingUp className="h-8 w-8 text-purple-600" />;
      case 'pending':
        return <FiClock className="h-8 w-8 text-yellow-600" />;
      case 'processing':
        return <FiPackage className="h-8 w-8 text-indigo-600" />;
      default:
        return <FiUsers className="h-8 w-8 text-blue-600" />;
    }
  };

  const getBgGradient = () => {
    switch(iconType) {
      case 'users':
      case 'orders':
        return 'from-blue-50 to-blue-100';
      case 'active':
      case 'revenue':
        return 'from-green-50 to-green-100';
      case 'inactive':
        return 'from-red-50 to-red-100';
      case 'new':
      case 'average':
        return 'from-purple-50 to-purple-100';
      case 'returning':
        return 'from-cyan-50 to-cyan-100';
      case 'pending':
        return 'from-yellow-50 to-yellow-100';
      case 'processing':
        return 'from-indigo-50 to-indigo-100';
      default:
        return 'from-gray-50 to-gray-100';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getBgGradient()} rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium truncate quantico-regular">{title}</h3>
          {isLoading ? (
            <div className="mt-2 h-7 w-24 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900 quantico-bold">
                {value}
              </p>
            </div>
          )}
          
          {trend !== undefined && !isLoading && (
            <div className="mt-2">
              <span className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'} font-medium flex items-center`}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                <span className="text-gray-500 ml-1">{trendLabel}</span>
              </span>
            </div>
          )}
        </div>
        <div className="rounded-md p-3 bg-white bg-opacity-80">
          {getIcon()}
        </div>
      </div>
    </div>
  );
};

export default MetricCard; 