// src/components/Orders/ReturnForm.jsx

import React, { useState } from 'react';
import Button from '../Common/Button';
import toast from 'react-hot-toast';

const ReturnForm = ({ onSubmit }) => {
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [reason, setReason] = useState('');

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    for (let item of items) {
      if (!item.productId.trim() || !item.quantity || item.quantity < 1) {
        toast.error('Please provide valid product IDs and quantities.');
        return;
      }
    }
    if (!reason.trim()) {
      toast.error('Please provide a reason for return.');
      return;
    }
    onSubmit({ items, reason: reason.trim() });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">Items to Return</h3>
      {items.map((item, index) => (
        <div key={index} className="flex space-x-2 items-center">
          <input
            type="text"
            placeholder="Product ID"
            value={item.productId}
            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="number"
            min="1"
            placeholder="Quantity"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
            required
            className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {index > 0 && (
            <Button
              type="button"
              onClick={() => removeItem(index)}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
            >
              Remove
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        onClick={addItem}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Item
      </Button>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Reason for Return
        </label>
        <textarea
          id="reason"
          name="reason"
          rows="4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter reason..."
        ></textarea>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={() => onSubmit({ items: null, reason: null })}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Submit Return Request
        </Button>
      </div>
    </form>
  );
};

export default ReturnForm;
