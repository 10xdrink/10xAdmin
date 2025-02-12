// src/components/Orders/UpdateTrackingForm.jsx

import React, { useState } from 'react';
import Button from '../Common/Button';
import toast from 'react-hot-toast';

const UpdateTrackingForm = ({ onSubmit }) => {
  const [trackingId, setTrackingId] = useState('');
  const [carrier, setCarrier] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!trackingId || !carrier) {
      toast.error('Please provide both tracking ID and carrier.');
      return;
    }
    onSubmit({ trackingId, carrier });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700">
          Tracking ID
        </label>
        <input
          type="text"
          id="trackingId"
          name="trackingId"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter tracking ID..."
        />
      </div>
      <div>
        <label htmlFor="carrier" className="block text-sm font-medium text-gray-700">
          Carrier
        </label>
        <input
          type="text"
          id="carrier"
          name="carrier"
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter carrier name..."
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={() => onSubmit({ trackingId: null, carrier: null })}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Tracking
        </Button>
      </div>
    </form>
  );
};

export default UpdateTrackingForm;
