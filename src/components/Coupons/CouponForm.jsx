// src/components/Coupons/CouponForm.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useCoupons from '../../hooks/useCoupons';
import Button from '../Common/Button';
import toast from 'react-hot-toast';

/**
 * CouponForm component for creating and editing coupons
 * @param {Object} props - Component props
 * @param {String|null} props.couponId - ID of the coupon to edit (null for creating)
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmit - Function to handle form submission
 * @returns {JSX.Element}
 */
const CouponForm = ({ couponId = null, onClose, onSubmit }) => {
  const { createNewCoupon, getCoupon, updateExistingCoupon } = useCoupons();
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    discountType: 'percentage',
    expirationDate: '',
    maxUses: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  // Fetch coupon data if editing
  useEffect(() => {
    const fetchData = async () => {
      if (couponId) {
        try {
          const data = await getCoupon(couponId);
          if (data && data.data) {
            setFormData({
              code: data.data.code,
              discount: data.data.discount,
              discountType: data.data.discountType,
              expirationDate: new Date(data.data.expirationDate).toISOString().split('T')[0],
              maxUses: data.data.maxUses || '',
              isActive: data.data.isActive,
            });
          }
        } catch (err) {
          // Error handled in context
        }
      }
    };
    fetchData();
  }, [couponId, getCoupon]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.code.trim()) {
      toast.error('Coupon code is required.');
      return;
    }
    if (!formData.discount || isNaN(formData.discount) || Number(formData.discount) <= 0) {
      toast.error('Discount must be a positive number.');
      return;
    }
    if (!formData.expirationDate) {
      toast.error('Expiration date is required.');
      return;
    }

    setLoading(true);

    const payload = {
      code: formData.code.trim(),
      discount: Number(formData.discount),
      discountType: formData.discountType,
      expirationDate: new Date(formData.expirationDate),
      maxUses: formData.maxUses ? Number(formData.maxUses) : null,
      isActive: formData.isActive,
    };

    try {
      if (couponId) {
        await updateExistingCoupon(couponId, payload);
      } else {
        await createNewCoupon(payload);
      }
      onSubmit();
    } catch (err) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Code Field */}
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Coupon Code
        </label>
        <input
          type="text"
          name="code"
          id="code"
          value={formData.code}
          onChange={handleChange}
          required
          disabled={!!couponId} // Disable editing code when editing a coupon
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Discount Field */}
      <div>
        <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
          Discount
        </label>
        <input
          type="number"
          name="discount"
          id="discount"
          value={formData.discount}
          onChange={handleChange}
          required
          min="0.01"
          step="0.01"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Discount Type Field */}
      <div>
        <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">
          Discount Type
        </label>
        <select
          name="discountType"
          id="discountType"
          value={formData.discountType}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
      </div>

      {/* Expiration Date Field */}
      <div>
        <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
          Expiration Date
        </label>
        <input
          type="date"
          name="expirationDate"
          id="expirationDate"
          value={formData.expirationDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
        />
      </div>

      {/* Max Uses Field */}
      <div>
        <label htmlFor="maxUses" className="block text-sm font-medium text-gray-700">
          Max Uses (Leave blank for unlimited)
        </label>
        <input
          type="number"
          name="maxUses"
          id="maxUses"
          value={formData.maxUses}
          onChange={handleChange}
          min="1"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* isActive Checkbox */}
      <div className="flex items-center">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-md">
          {couponId ? 'Update Coupon' : 'Create Coupon'}
        </Button>
      </div>
    </form>
  );
};

CouponForm.propTypes = {
  couponId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CouponForm;
