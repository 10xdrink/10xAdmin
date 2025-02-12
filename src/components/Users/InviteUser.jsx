// src/components/Users/InviteUser.jsx

import React, { useState } from 'react';
import Button from '../Common/Button';
import { useFormik } from 'formik';
import { inviteUserValidationSchema } from '../../utils/validation';
import toast from 'react-hot-toast';

const InviteUser = ({ onInvite }) => {
  const [loading, setLoading] = useState(false);

  // Initialize Formik for form handling and validation
  const formik = useFormik({
    initialValues: {
      email: '',
      role: '',
    },
    validationSchema: inviteUserValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        await onInvite(values.email, values.role);
        resetForm();
      } catch (error) {
        // Error handling is managed in the parent component with toasts
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 max-w-md">
      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className={`mt-1 block w-full px-3 py-2 border ${
            formik.touched.email && formik.errors.email
              ? 'border-red-500'
              : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="john.doe@example.com"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
        )}
      </div>

      {/* Role Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          name="role"
          value={formik.values.role}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className={`mt-1 block w-full px-3 py-2 bg-white border ${
            formik.touched.role && formik.errors.role
              ? 'border-red-500'
              : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
        >
          <option value="">-- Select Role --</option>
          {Object.values(USER_ROLES).map((role) => (
            <option key={role} value={role}>
              {role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
        {formik.touched.role && formik.errors.role && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.role}</p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
        >
          {loading ? 'Sending...' : 'Send Invitation'}
        </Button>
      </div>
    </form>
  );
};

export default InviteUser;
