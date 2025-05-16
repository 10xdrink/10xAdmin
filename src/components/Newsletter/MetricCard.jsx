// src/components/Newsletter/MetricCard.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { FiUsers, FiUserCheck, FiUserX, FiUserPlus } from 'react-icons/fi';
import { MdMarkEmailRead, MdOutlineMarkEmailRead } from 'react-icons/md';

/**
 * MetricCard Component for Newsletter Subscribers
 *
 * Displays a metric with a title and value.
 *
 * Props:
 * - title (string, required): The title of the metric.
 * - value (number|string, optional): The value of the metric. Defaults to 'N/A' if not provided.
 * - isLoading (boolean, optional): Whether the metric is loading.
 * - iconType (string, optional): Type of icon to display ('users', 'active', 'new', 'open', 'click').
 */
const MetricCard = ({ title, value, isLoading, iconType }) => {
  // Helper to render the right icon based on the type
  const renderIcon = () => {
    switch (iconType) {
      case 'active':
        return <FiUserCheck className="text-white text-2xl" />;
      case 'new':
        return <FiUserPlus className="text-white text-2xl" />;
      case 'open':
        return <MdMarkEmailRead className="text-white text-2xl" />;
      case 'click':
        return <MdOutlineMarkEmailRead className="text-white text-2xl" />;
      case 'users':
      default:
        return <FiUsers className="text-white text-2xl" />;
    }
  };
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-500 quantico-bold-italic">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900 quantico-bold">
          {isLoading ? (
            <span className="inline-block w-8 h-8 animate-pulse bg-gray-200 rounded"></span>
          ) : (
            value !== undefined && value !== null ? value : 'N/A'
          )}
        </p>
      </div>
      <div className={`bg-gradient-to-r from-[#A467F7] to-[#4C03CB] p-3 rounded-full ${isLoading ? 'opacity-50' : ''}`}>
        {renderIcon()}
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
  iconType: PropTypes.oneOf(['users', 'active', 'new', 'open', 'click'])
};

MetricCard.defaultProps = {
  value: 'N/A',
  isLoading: false,
  iconType: 'users'
};

export default MetricCard;
