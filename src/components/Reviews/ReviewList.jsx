// src/components/Reviews/ReviewList.jsx

import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Common/Button';
import HighlightText from '../Users/HighlightText'; // Ensure this component exists
import clsx from 'clsx';

/**
 * ReviewList component to display a list of reviews
 * @param {Object} props - Component props
 * @param {Array} props.reviews - List of reviews
 * @param {Array} props.selectedReviewIds - Selected review IDs
 * @param {Function} props.handleSelect - Function to handle individual selection
 * @param {Function} props.handleSelectAll - Function to handle selecting all
 * @param {Function} props.onView - Function to view review details
 * @param {Function} props.onUpdate - Function to approve/reject a review
 * @param {Function} props.onDelete - Function to delete a review
 * @param {String} props.searchQuery - Current search query
 * @returns {JSX.Element}
 */
const ReviewList = ({
  reviews,
  selectedReviewIds,
  handleSelect,
  handleSelectAll,
  onView,
  onUpdate,
  onDelete,
  searchQuery = '',
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-6 text-left">
              <input
                type="checkbox"
                checked={selectedReviewIds.length === reviews.length && reviews.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
            </th>
            <th className="py-3 px-6 text-left">Product</th>
            <th className="py-3 px-6 text-left">User</th>
            <th className="py-3 px-6 text-left">Rating</th>
            <th className="py-3 px-6 text-left">Comment</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr
              key={review._id}
              className="border-b hover:bg-gray-100"
            >
              <td className="py-4 px-6">
                <input
                  type="checkbox"
                  checked={selectedReviewIds.includes(review._id)}
                  onChange={() => handleSelect(review._id)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
              </td>

              <td className="py-4 px-6">
                <HighlightText text={review.product?.title || 'N/A'} highlight={searchQuery} />
              </td>
              <td className="py-4 px-6">
                {review.user?.name ? (
                  `${review.user.name} (${review.user.email})`
                ) : (
                  'N/A'
                )}
              </td>
              <td className="py-4 px-6">
                {'⭐'.repeat(review.rating)}{' '}
                <span className="text-gray-500">({review.rating})</span>
              </td>
              <td className="py-4 px-6">
                {review.commentPreview || 'N/A'}
              </td>
              <td className="py-4 px-6">
                {review.isApproved ? (
                  <span className="text-green-600">Approved</span>
                ) : (
                  <span className="text-yellow-600">Pending</span>
                )}
              </td>
              <td className="py-4 px-6">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onView(review._id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1 rounded-md"
                  >
                    View
                  </Button>
                  {!review.isApproved && (
                    <Button
                      onClick={() => onUpdate(review._id, true)}
                      className="bg-gradient-to-r from-green-500 to-green-700 text-white px-3 py-1 rounded-md"
                    >
                      Approve
                    </Button>
                  )}
                  {review.isApproved && (
                    <Button
                      onClick={() => onUpdate(review._id, false)}
                      className="bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1 rounded-md"
                    >
                      Reject
                    </Button>
                  )}
                  <Button
                    onClick={() => onDelete(review._id)}
                    className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {reviews.length === 0 && (
            <tr>
              <td className="py-4 px-6 text-center" colSpan="7">
                No reviews found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

ReviewList.propTypes = {
  reviews: PropTypes.array.isRequired,
  selectedReviewIds: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
};

export default ReviewList;
