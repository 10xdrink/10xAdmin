// src/components/Coupons/CouponDetails.jsx

import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Common/Button';

/**
 * CouponDetails component to display detailed information about a coupon
 * @param {Object} props - Component props
 * @param {Object} props.coupon - Coupon data
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onEdit - Function to edit the coupon
 * @param {Function} props.onDelete - Function to delete the coupon
 * @returns {JSX.Element}
 */
const CouponDetails = ({ coupon, onClose, onEdit, onDelete }) => {
  return (
    <div>
      <div className="space-y-4">
        <div>
          <strong>Code:</strong> {coupon.code}
        </div>
        <div>
          <strong>Discount:</strong> {coupon.discount} {coupon.discountType === 'percentage' ? '%' : '$'}
        </div>
        <div>
          <strong>Discount Type:</strong> {coupon.discountType.charAt(0).toUpperCase() + coupon.discountType.slice(1)}
        </div>
        <div>
          <strong>Expiration Date:</strong> {new Date(coupon.expirationDate).toLocaleDateString()}
        </div>
        <div>
          <strong>Max Uses:</strong> {coupon.maxUses || 'Unlimited'}
        </div>
        <div>
          <strong>Used Count:</strong> {coupon.usedCount}
        </div>
        <div>
          <strong>Status:</strong> {coupon.isActive && !coupon.isExpired ? 'Active' : 'Inactive'}
        </div>
        {/* Add more fields as necessary */}
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <Button
          onClick={() => onEdit(coupon._id)}
          className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
        >
          Edit
        </Button>
        <Button
          onClick={() => onDelete(coupon._id)}
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

CouponDetails.propTypes = {
  coupon: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CouponDetails;
