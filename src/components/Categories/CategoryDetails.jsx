// src/components/Categories/CategoryDetails.jsx

import React from 'react';
import Button from '../Common/Button';
import { formatDate } from '../../utils/helpers';

/**
 * CategoryDetails component to display category information
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
const CategoryDetails = ({ category, onClose, onEdit, onDelete }) => {
  if (!category) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Category Details</h2>
      <div className="space-y-2">
        <p><span className="font-semibold">Name:</span> {category.name}</p>
        <p><span className="font-semibold">Type:</span> {category.type}</p>
        <p><span className="font-semibold">Description:</span> {category.description || 'N/A'}</p>
        <p>
          <span className="font-semibold">Parent Category:</span> {category.parent ? (
            category.parent.name ? (
              <span>{category.parent.name}</span>
            ) : (
              'N/A'
            )
          ) : (
            'None'
          )}
        </p>
        <p><span className="font-semibold">Status:</span> {category.isActive ? 'Active' : 'Inactive'}</p>
        <p><span className="font-semibold">Created At:</span> {formatDate(category.createdAt)}</p>
        <p><span className="font-semibold">Updated At:</span> {formatDate(category.updatedAt)}</p>
      </div>
      <div className="mt-6 flex space-x-4">
        <Button
          onClick={() => onEdit(category._id)}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
        >
          Edit
        </Button>
        <Button
          onClick={() => onDelete(category._id)}
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

export default CategoryDetails;
