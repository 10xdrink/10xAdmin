// src/components/Tags/TagDetails.jsx

import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Common/Button';

/**
 * TagDetails component to display tag information
 * @param {Object} props - Component props
 * @param {Object} props.tag - Tag data
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onEdit - Function to edit the tag
 * @param {Function} props.onDelete - Function to delete the tag
 * @returns {JSX.Element}
 */
const TagDetails = ({ tag, onClose, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      <p><strong>Name:</strong> {tag.name}</p>
      <p><strong>Description:</strong> {tag.description || 'N/A'}</p>
      <p><strong>Status:</strong> {tag.isActive ? 'Active' : 'Inactive'}</p>
      <p><strong>Created At:</strong> {new Date(tag.createdAt).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(tag.updatedAt).toLocaleString()}</p>

      <div className="flex justify-end space-x-4">
        <Button
          onClick={() => onEdit(tag._id)}
          className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
        >
          Edit
        </Button>
        <Button
          onClick={() => onDelete(tag._id)}
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

TagDetails.propTypes = {
  tag: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TagDetails;
