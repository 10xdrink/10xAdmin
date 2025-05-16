// src/components/FAQs/FAQDetails.jsx

import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Common/Button';

/**
 * FAQDetails component to display detailed information about an FAQ
 * @param {Object} props - Component props
 * @param {Object} props.faq - FAQ data
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onEdit - Function to edit the FAQ
 * @param {Function} props.onDelete - Function to delete the FAQ
 * @returns {JSX.Element}
 */
const FAQDetails = ({ faq, onClose, onEdit, onDelete }) => {
  return (
    <div>
      <div className="space-y-4">
        <div>
          <strong>Question:</strong> {faq.question}
        </div>
        <div>
          <strong>Answer:</strong> {faq.answer}
        </div>
        <div>
          <strong>Tags:</strong> {faq.tags.join(', ')}
        </div>
        <div>
          <strong>Status:</strong> {faq.isActive ? 'Active' : 'Inactive'}
        </div>
        <div>
          <strong>Created At:</strong> {new Date(faq.createdAt).toLocaleString()}
        </div>
        <div>
          <strong>Updated At:</strong> {new Date(faq.updatedAt).toLocaleString()}
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <Button
          onClick={() => onEdit(faq._id)}
          className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
        >
          Edit
        </Button>
        <Button
          onClick={() => onDelete(faq._id)}
          className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
        >
          Delete
        </Button>
        <Button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

FAQDetails.propTypes = {
  faq: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FAQDetails;
