// src/components/Reviews/ReviewDetails.jsx

import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Common/Button';

/**
 * ReviewDetails component to display review information
 * @param {Object} props - Component props
 * @param {Object} props.review - Review data
 * @param {Function} props.onClose - Function to close the modal
 * @returns {JSX.Element}
 */
const ReviewDetails = ({ review, onClose }) => {
  return (
    <div className="space-y-4">
      <div>
        <strong>Product:</strong> {review.product.title}
      </div>
      <div>
        <strong>User:</strong> {review.user.name} ({review.user.email})
      </div>
      <div>
        <strong>Rating:</strong> {'⭐'.repeat(review.rating)} ({review.rating})
      </div>
      <div>
        <strong>Comment:</strong> {review.comment || 'N/A'}
      </div>
      <div>
        <strong>Status:</strong> {review.isApproved ? 'Approved' : 'Pending'}
      </div>
      {review.photos && review.photos.length > 0 && (
        <div>
          <strong>Photos:</strong>
          <div className="flex space-x-2 mt-2">
            {review.photos.map((photo) => (
              <img
                key={photo.public_id}
                src={photo.url}
                alt="Review"
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}
      <div>
        <strong>Created At:</strong> {new Date(review.createdAt).toLocaleString()}
      </div>
      <div>
        <strong>Updated At:</strong> {new Date(review.updatedAt).toLocaleString()}
      </div>
      <div className="flex justify-end space-x-4">
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

ReviewDetails.propTypes = {
  review: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReviewDetails;
