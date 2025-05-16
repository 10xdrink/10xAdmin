// src/components/Users/InviteUser.jsx

import React, { useState } from 'react';
import Button from '../Common/Button';
import { useFormik } from 'formik';
import { inviteUserValidationSchema } from '../../utils/validation';
import toast from 'react-hot-toast';
import { USER_ROLES } from '../../utils/constants';

const InviteUser = ({ onInvite, isLoading }) => {
  // Initialize Formik for form handling and validation
  const formik = useFormik({
    initialValues: {
      email: '',
      role: '',
    },
    validationSchema: inviteUserValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await onInvite(values.email, values.role);
        resetForm();
      } catch (error) {
        // Error handling is managed in the parent component with toasts
        console.error("Form submission error:", error);
      }
    },
  });

  return (
    <div>
      {/* Info alert explaining invitation restrictions */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> You can only invite email addresses that:
              <ul className="list-disc pl-5 mt-1">
                <li>Don't already have an account</li>
                <li>Don't have a pending invitation</li>
              </ul>
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            disabled={isLoading}
            className={`block w-full px-4 py-3 border ${
              formik.touched.email && formik.errors.email
                ? 'border-red-500'
                : 'border-gray-300'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder="user@example.com"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* Role Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
          <select
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            disabled={isLoading}
            className={`block w-full px-4 py-3 border ${
              formik.touched.role && formik.errors.role
                ? 'border-red-500'
                : 'border-gray-300'
            } rounded-md shadow-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          >
            <option value="">-- Select Role --</option>
            {Object.entries(USER_ROLES).map(([key, value]) => (
              <option key={key} value={value}>
                {value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
          {formik.touched.role && formik.errors.role && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.role}</p>
          )}
        </div>

        {/* Role Description */}
        {formik.values.role && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">About this role:</h3>
            <p className="text-sm text-gray-600">
              {getRoleDescription(formik.values.role)}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading || !formik.isValid || formik.isSubmitting}
            className="w-full bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white py-3 px-6 rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Invitation...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Invitation
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Helper function to get role descriptions
const getRoleDescription = (role) => {
  const descriptions = {
    [USER_ROLES.SUPER_ADMIN]: "Has full access to all resources and functionalities across the platform.",
    [USER_ROLES.PRODUCT_MANAGER]: "Manages products, categories, and inventory.",
    [USER_ROLES.ORDER_MANAGER]: "Handles orders, refunds, and transactions.",
    [USER_ROLES.CONTENT_MANAGER]: "Manages blog posts, FAQs, and SEO content.",
    [USER_ROLES.CUSTOMER_SUPPORT_MANAGER]: "Handles customer inquiries and support tickets.",
    [USER_ROLES.MARKETING_MANAGER]: "Manages discounts, coupons, and email campaigns.",
    [USER_ROLES.ANALYTICS_VIEWER]: "Can view reports and analytics but cannot modify data.",
    [USER_ROLES.ADMIN_ASSISTANT]: "Assists admins with limited access to certain admin features.",
    [USER_ROLES.INVENTORY_MANAGER]: "Manages stock levels and warehouse tracking.",
    [USER_ROLES.SEO_MANAGER]: "Focuses on SEO and site optimization content.",
    [USER_ROLES.SALES_MANAGER]: "Oversees sales-related processes and performance monitoring.",
    [USER_ROLES.FINANCE_MANAGER]: "Manages financial reports, transactions, and budgets.",
    [USER_ROLES.USER]: "Regular user with basic permissions."
  };

  return descriptions[role] || "No description available for this role.";
};

export default InviteUser;
