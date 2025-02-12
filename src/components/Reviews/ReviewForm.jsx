// src/components/Reviews/ReviewForm.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../Common/Button';

/**
 * ReviewForm component for approving/rejecting a review
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {Function} props.onClose - Function to close the modal
 * @returns {JSX.Element}
 */
const ReviewForm = ({ onSubmit, onClose }) => {
  const [isApproved, setIsApproved] = useState(true);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(isApproved, comment);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Approval Status</label>
        <select
          value={isApproved}
          onChange={(e) => setIsApproved(e.target.value === 'true')}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="true">Approve</option>
          <option value="false">Reject</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          placeholder="Optional comment for the user"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

ReviewForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReviewForm;
