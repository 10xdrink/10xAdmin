// src/components/Users/UserForm.jsx

import React, { useState } from 'react';
import Button from '../Common/Button';
import { USER_ROLES } from '../../utils/constants';
import { useFormik } from 'formik';
import { userFormValidationSchema } from '../../utils/validation';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const UserForm = ({ initialData = {}, onSubmit }) => {
  const isEditMode = !!initialData._id; // Determine form mode based on presence of initialData

  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For toggling confirm password visibility

  // Initialize Formik for form handling and validation
  const formik = useFormik({
    initialValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      role: initialData.role || USER_ROLES.USER,
      profilePicture: null, // Reset profilePicture to allow re-upload if needed
      // Password fields are only relevant in create mode
      password: '',
      confirmPassword: '',
    },
    validationSchema: userFormValidationSchema(isEditMode), // Apply conditional validation
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // Check if the selected role is "USER" when creating a new user
      if (!isEditMode && values.role === USER_ROLES.USER) {
        toast.error("Sorry, we can't create a normal user from the form.");
        setSubmitting(false); // Finish the submitting state
        return; // Abort the submission
      }

      try {
        // Prepare form data for multipart/form-data
        const data = new FormData();
        data.append('name', values.name);
        data.append('email', values.email);
        data.append('role', values.role);
        if (values.profilePicture) {
          data.append('profilePicture', values.profilePicture);
        }
        if (!isEditMode) {
          data.append('password', values.password);
          data.append('confirmPassword', values.confirmPassword);
        }

        // Debugging: Log FormData entries
        for (let pair of data.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }

        await onSubmit(data); // Call the onSubmit prop with form data
        resetForm(); // Reset the form upon successful submission
      } catch (err) {
        // Error handling is managed in the parent component
      } finally {
        setSubmitting(false); // Finish the submitting state
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className={`mt-1 block w-full px-3 py-2 border ${
            formik.touched.name && formik.errors.name
              ? 'border-red-500'
              : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="John Doe"
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
        )}
      </div>

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
          <option value="">Select Role</option>
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

      {/* Profile Picture Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={(e) => {
            formik.setFieldValue('profilePicture', e.currentTarget.files[0]);
          }}
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {formik.touched.profilePicture && formik.errors.profilePicture && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.profilePicture}</p>
        )}
      </div>

      {/* Password Fields - Only in Create Mode */}
      {!isEditMode && (
        <>
          {/* Password Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                formik.touched.password && formik.errors.password
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="********"
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="********"
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>
        </>
      )}

      {/* Submit Button */}
      <div>
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-md"
        >
          {formik.isSubmitting
            ? isEditMode
              ? 'Updating...'
              : 'Creating...'
            : isEditMode
            ? 'Update User'
            : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
