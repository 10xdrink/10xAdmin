// src/components/Common/LoadingSpinner.jsx

import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-600 ${sizeClass}`}></div>
    </div>
  );
};

export default LoadingSpinner;
