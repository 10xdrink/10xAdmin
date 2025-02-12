// src/components/Common/MetricsCard.jsx

import React from 'react';

const MetricsCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center w-48 md:w-60">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-indigo-600">{value}</p>
    </div>
  );
};

export default MetricsCard;
