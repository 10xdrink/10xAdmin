// src/components/Common/Tabs.jsx
import React from 'react';

export const Tabs = ({ children, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
};

export const Tab = ({ children, active, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium ${
        active
          ? 'border-b-2 border-indigo-500 text-indigo-600'
          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export const TabPanel = ({ children, active, className = '' }) => {
  if (!active) return null;
  
  return (
    <div className={`py-4 ${className}`}>
      {children}
    </div>
  );
};

export default { Tabs, Tab, TabPanel };
