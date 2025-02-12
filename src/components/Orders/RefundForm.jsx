// src/components/Orders/RefundForm.jsx

import React, { useState } from 'react';
import Button from '../Common/Button';
import toast from 'react-hot-toast';

const RefundForm = ({ onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid refund amount.');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please provide a reason for the refund.');
      return;
    }
    onSubmit({ amount: parseFloat(amount), reason: reason.trim() });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Refund Amount ($)
        </label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          id="amount"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter refund amount"
        />
      </div>
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Reason for Refund
        </label>
        <textarea
          id="reason"
          name="reason"
          rows="4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter reason..."
        ></textarea>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={() => onSubmit({ amount: null, reason: null })}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
        >
          Process Refund
        </Button>
      </div>
    </form>
  );
};

export default RefundForm;
