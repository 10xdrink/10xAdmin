// src/components/Users/InviteSignup.jsx

import React, { useState, useEffect } from 'react';
import Button from '../Common/Button';
import { useFormik } from 'formik';
import axios from 'axios';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const InviteSignup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  // Extract token from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const inviteToken = params.get('token');
    if (inviteToken) {
      setToken(inviteToken);
      setLoading(false);
    } else {
      toast.error('Invalid invitation link.');
      navigate('/login'); // Redirect to login or appropriate page
    }
  }, [location.search, navigate]);

  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: null, // Add validation schema if using one
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!token) {
        toast.error('Invalid or missing token.');
        return;
      }

      if (values.password !== values.confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }

      try {
        const response = await axios.post('/api/users/signup', {
          token,
          name: values.name,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });

        if (response.data.success) {
          toast.success('Account created successfully.');
          // Optionally, log the user in by storing the token
          localStorage.setItem('authToken', response.data.token);
          navigate('/dashboard'); // Redirect to dashboard or desired page
        } else {
          toast.error(response.data.message || 'Signup failed.');
        }
      } catch (error) {
        console.error('Signup Error:', error);
        const message =
          error.response?.data?.message ||
          'An error occurred during signup.';
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Set Up Your Account</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
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
        {/* Submit Button */}
        <div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md">
            Set Up Account
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InviteSignup;
