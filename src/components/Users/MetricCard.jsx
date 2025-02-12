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
 */
const MetricCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900">
          {value !== undefined && value !== null ? value : 'N/A'}
        </p>
      </div>
      <div className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] p-3 rounded-full">
        {/* Replace with relevant icons based on the metric */}
        <i className="fa-solid fa-users text-white text-2xl"></i>
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
};

MetricCard.defaultProps = {
  value: 'N/A',
};

export default MetricCard;
