// src/components/Users/MetricCard.jsx

import React from 'react';
import PropTypes from 'prop-types';

/**
 * MetricCard Component
 *
 * Displays a metric with a title and value.
 *
 * Props:
 * - title (string, required): The title of the metric.
 * - value (number|string, optional): The value of the metric. Defaults to 'N/A' if not provided.
 * - isLoading (boolean, optional): Whether the metric is loading.
 * - iconType (string, optional): Type of icon to display ('users', 'active', 'inactive', 'new', 'returning').
 */
const MetricCard = ({ title, value, isLoading, iconType }) => {
  // Helper to get the right icon class based on the type
  const getIconClass = () => {
    switch (iconType) {
      case 'active':
        return 'fa-solid fa-user-check';
      case 'inactive':
        return 'fa-solid fa-user-xmark';
      case 'new':
        return 'fa-solid fa-user-plus';
      case 'returning':
        return 'fa-solid fa-user-clock';
      case 'users':
      default:
        return 'fa-solid fa-users';
    }
  };
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900">
          {isLoading ? (
            <span className="inline-block w-8 h-8 animate-pulse bg-gray-200 rounded"></span>
          ) : (
            value !== undefined && value !== null ? value : 'N/A'
          )}
        </p>
      </div>
      <div className={`bg-gradient-to-r from-[#A467F7] to-[#4C03CB] p-3 rounded-full ${isLoading ? 'opacity-50' : ''}`}>
        <i className={`${getIconClass()} text-white text-2xl`}></i>
      </div>
    </div>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  isLoading: PropTypes.bool,
  iconType: PropTypes.oneOf(['users', 'active', 'inactive', 'new', 'returning'])
};

MetricCard.defaultProps = {
  value: 'N/A',
  isLoading: false,
  iconType: 'users'
};

export default MetricCard;
