// src/components/Orders/BulkUpdateForm.jsx

import React, { useState } from 'react';
import Button from '../Common/Button';
import Select from 'react-select';
import toast from 'react-hot-toast';

const BulkUpdateForm = ({ onSubmit }) => {
  const [newStatus, setNewStatus] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newStatus) {
      toast.error('Please select a new status.');
      return;
    }
    onSubmit({ newStatus });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700">
          Select New Status
        </label>
        <Select
          options={statusOptions}
          value={statusOptions.find(option => option.value === newStatus)}
          onChange={(option) => setNewStatus(option.value)}
          placeholder="Select new status"
          isClearable
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={() => onSubmit({ newStatus: null })}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
        >
          Update Status
        </Button>
      </div>
    </form>
  );
};

export default BulkUpdateForm;
