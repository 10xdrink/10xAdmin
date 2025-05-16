// src/components/Coupons/CouponList.jsx

import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Common/Button';
import HighlightText from '../HighlightText';
import clsx from 'clsx';

/**
 * CouponList component to display a list of coupons
 * @param {Object} props - Component props
 * @param {Array} props.coupons - List of coupons
 * @param {Array} props.selectedCouponIds - Selected coupon IDs
 * @param {Function} props.handleSelect - Function to handle individual selection
 * @param {Function} props.handleSelectAll - Function to handle selecting all
 * @param {Function} props.onView - Function to view coupon details
 * @param {Function} props.onEdit - Function to edit a coupon
 * @param {Function} props.onDelete - Function to delete a coupon
 * @param {Function} props.onDeactivate - Function to deactivate a coupon
 * @param {Function} props.onActivate - Function to activate a coupon
 * @param {String} props.searchQuery - Current search query
 * @param {String} props.sortField - Current sort field
 * @param {String} props.sortOrder - Current sort order
 * @returns {JSX.Element}
 */
const CouponList = ({
  coupons,
  selectedCouponIds,
  handleSelect,
  handleSelectAll,
  onView,
  onEdit,
  onDelete,
  onDeactivate,
  onActivate,
  searchQuery = '',
  sortField = 'code',
  sortOrder = 'asc',
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-6 text-left">
              <input
                type="checkbox"
                checked={selectedCouponIds.length === coupons.length && coupons.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
            </th>
            <th className="py-3 px-6 text-left cursor-pointer">
              Code
            </th>
            <th className="py-3 px-6 text-left">
              Discount
            </th>
            <th className="py-3 px-6 text-left">
              Type
            </th>
            <th className="py-3 px-6 text-left">
              Expiration Date
            </th>
            <th className="py-3 px-6 text-left">
              Max Uses
            </th>
            <th className="py-3 px-6 text-left">
              Status
            </th>
            <th className="py-3 px-6 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr
              key={coupon._id}
              className="border-b hover:bg-gray-100"
            >
              <td className="py-4 px-6">
                <input
                  type="checkbox"
                  checked={selectedCouponIds.includes(coupon._id)}
                  onChange={() => handleSelect(coupon._id)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
              </td>

              <td className="py-4 px-6">
                <HighlightText
                  text={coupon.code}
                  highlight={searchQuery}
                />
              </td>
              <td className="py-4 px-6">
                {coupon.discount} {coupon.discountType === 'percentage' ? '%' : '$'}
              </td>
              <td className="py-4 px-6 capitalize">
                {coupon.discountType}
              </td>
              <td className="py-4 px-6">
                {new Date(coupon.expirationDate).toLocaleDateString()}
              </td>
              <td className="py-4 px-6">
                {coupon.maxUses || 'Unlimited'}
              </td>
              <td className="py-4 px-6">
                {coupon.isActive && !coupon.isExpired ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </td>
              <td className="py-4 px-6">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onView(coupon._id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => onEdit(coupon._id)}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Edit
                  </Button>
                  {coupon.isActive ? (
                    <Button
                      onClick={() => onDeactivate(coupon._id)}
                      className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onActivate(coupon._id)}
                      className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
                    >
                      Activate
                    </Button>
                  )}
                  <Button
                    onClick={() => onDelete(coupon._id)}
                    className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {coupons.length === 0 && (
            <tr>
              <td className="py-4 px-6 text-center" colSpan="8">
                No coupons found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

CouponList.propTypes = {
  coupons: PropTypes.array.isRequired,
  selectedCouponIds: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDeactivate: PropTypes.func.isRequired,
  onActivate: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  sortField: PropTypes.string,
  sortOrder: PropTypes.string,
};

export default CouponList;
