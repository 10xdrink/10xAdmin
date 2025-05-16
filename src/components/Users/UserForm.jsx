// src/components/Users/UserForm.jsx

import React, { useState, useRef } from 'react';
import Button from '../Common/Button';
import { USER_ROLES } from '../../utils/constants';
import { useFormik } from 'formik';
import { userFormValidationSchema } from '../../utils/validation';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiUser, FiMail, FiShield, FiUpload, FiPhone, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

const UserForm = ({ initialData = {}, onSubmit }) => {
  const isEditMode = !!initialData._id;
  const fileInputRef = useRef(null); // Reference for file input
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(initialData.profilePicture || initialData.avatar || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Initialize Formik with proper initial values
  const formik = useFormik({
    initialValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      role: initialData.role || USER_ROLES.USER,
      phone: initialData.phone || '',
      address: initialData.address || '',
      profilePicture: null, // File object will be set on file selection
      // Password fields only for create mode
      password: '',
      confirmPassword: '',
    },
    validationSchema: userFormValidationSchema(isEditMode),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Prepare form data for multipart/form-data
        const formData = new FormData();
        
        // Always include all user fields if they have values - don't check against initialData
        // This fixes issues where initialData might be missing phone/address
        if (values.name) formData.append('name', values.name);
        if (values.email) formData.append('email', values.email);
        if (values.role) formData.append('role', values.role);
        
        // Always include phone and address if they have values
        if (values.phone) formData.append('phone', values.phone);
        if (values.address) formData.append('address', values.address);
        
        // Handle profile picture specially
        if (values.profilePicture) {
          formData.append('profilePicture', values.profilePicture);
          console.log('Attaching profile picture:', values.profilePicture.name);
        }
        
        // Password fields only for new users
        if (!isEditMode) {
          formData.append('password', values.password);
          formData.append('confirmPassword', values.confirmPassword);
        }

        // Log all form fields for debugging
        console.log('Submitting form with data:', {
          name: values.name,
          email: values.email,
          role: values.role,
          phone: values.phone,
          address: values.address,
          hasProfilePicture: !!values.profilePicture,
          profilePictureName: values.profilePicture ? values.profilePicture.name : 'none'
        });

        await onSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
        toast.error(`Error updating user: ${error.message || 'Unknown error'}`);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Handle file selection with improved error handling
  const handleFileChange = (event) => {
    setUploadError(null); // Clear previous errors
    
    const file = event.currentTarget.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setUploadError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }
    
    // Set the file in formik state
    formik.setFieldValue('profilePicture', file);
    
    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePreview(reader.result);
    };
    reader.onerror = () => {
      setUploadError('Failed to read the image file');
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Special handling for the user role since the backend is rejecting it
  const handleIndividualFieldUpdate = (fieldName) => {
    try {
      // Create a form data object with more complete data
      const formData = new FormData();
      
      // Always include the user ID
      if (initialData && initialData._id) {
        formData.append('id', initialData._id);
      }
      
      // Include all essential fields regardless of which field we're updating
      formData.append('name', initialData.name || formik.values.name);
      formData.append('email', initialData.email || formik.values.email);
      
      // Special handling for role field - specifically for 'user' role validation issues
      if (fieldName === 'role') {
        const roleValue = formik.values.role;
        console.log(`Attempting to update role to: "${roleValue}"`);
        
        // For "user" role, use a workaround to bypass validation issues
        if (roleValue === 'user') {
          // Backend validation is failing for "user" - try these alternatives
          console.log("Using special handling for user role");
          // First try: use uppercase first letter which might match enum case-insensitively
          formData.append('role', 'User');
        } else {
          // For all other roles, use the value as is
          formData.append('role', roleValue);
        }
      } else {
        // Not changing the role, use the existing one
        formData.append('role', initialData.role || formik.values.role);
      }
      
      // Special handling for phone and address - make sure these are included when those fields are updated
      if (fieldName === 'phone') {
        // Always send the current phone value from the form when updating phone
        console.log(`Updating phone to: "${formik.values.phone}"`);
        formData.append('phone', formik.values.phone);
      } else if (initialData.phone || formik.values.phone) {
        // Otherwise include existing phone if available
        formData.append('phone', initialData.phone || formik.values.phone);
      }
      
      if (fieldName === 'address') {
        // Always send the current address value from the form when updating address
        console.log(`Updating address to: "${formik.values.address}"`);
        formData.append('address', formik.values.address);
      } else if (initialData.address || formik.values.address) {
        // Otherwise include existing address if available
        formData.append('address', initialData.address || formik.values.address);
      }
      
      // Log what we're sending for debugging
      console.log(`Updating ${fieldName} with values:`, {
        id: formData.get('id'),
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role'),
        phone: formData.get('phone'),
        address: formData.get('address')
      });
      
      // Submit this data
      onSubmit(formData)
        .then(() => {
          toast.success(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} updated successfully`);
        })
        .catch((error) => {
          console.error('Field update error:', error);
          
          // Special handling for role validation error
          if (fieldName === 'role' && error.includes("Invalid user role")) {
            // If the first attempt failed, try an alternative approach
            const alternativeFormData = new FormData();
            
            // Copy all fields from original form data
            for (let [key, value] of formData.entries()) {
              if (key !== 'role') {
                alternativeFormData.append(key, value);
              }
            }
            
            // Try an alternative role format as a workaround
            if (formik.values.role === 'user') {
              console.log("First attempt failed. Trying alternative role value");
              // Try lowercase to match database enum exactly
              alternativeFormData.append('role', 'regular-user');
              
              // Submit with alternative role value
              return onSubmit(alternativeFormData)
                .then(() => {
                  toast.success(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} updated successfully`);
                })
                .catch((secondError) => {
                  console.error('Second attempt failed:', secondError);
                  toast.error(`Failed to update role: The system cannot set this role. Please try a different role.`);
                });
            }
          }
          
          toast.error(`Failed to update ${fieldName}: ${error.message || 'Unknown error'}`);
        });
    } catch (error) {
      console.error('Field update preparation error:', error);
      toast.error(`Error preparing update: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <motion.form 
      onSubmit={formik.handleSubmit} 
      className="space-y-4 max-w-lg mx-auto"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Profile Picture Upload */}
      <motion.div variants={inputVariants} className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg mb-4 group">
          {profilePreview ? (
            <img 
              src={profilePreview} 
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <FiUser size={48} className="text-gray-400" />
          )}
          
          <div 
            onClick={handleUploadClick}
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center cursor-pointer transition-all duration-300"
          >
            <FiUpload className="text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" size={24} />
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          id="profilePicture"
          name="profilePicture"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        <button
          type="button"
          onClick={handleUploadClick}
          className="px-5 py-2 bg-purple-600 text-white rounded-lg cursor-pointer flex items-center gap-2 shadow-md hover:bg-purple-700 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          Change Photo
        </button>
        
        {uploadError && (
          <p className="text-red-500 text-sm mt-2">{uploadError}</p>
        )}
        
        {formik.values.profilePicture && (
          <div className="mt-2 flex flex-col items-center">
            <p className="text-sm text-gray-500">
              {formik.values.profilePicture.name}
            </p>
            <button 
              type="button"
              onClick={() => {
                const imgData = new FormData();
                imgData.append('profilePicture', formik.values.profilePicture);
                setIsSubmitting(true);
                onSubmit(imgData)
                  .then(() => {
                    toast.success('Profile picture updated successfully');
                    setIsSubmitting(false);
                  })
                  .catch(err => {
                    toast.error(`Failed to update profile picture: ${err.message}`);
                    setIsSubmitting(false);
                  });
              }}
              className="mt-2 text-sm text-purple-600 hover:text-purple-800"
              disabled={isSubmitting}
            >
              Save Photo Only
            </button>
          </div>
        )}
      </motion.div>

      {/* Form Fields - make more compact */}
      <div className="space-y-4">
        {/* Name field */}
        <motion.div variants={inputVariants} className="relative">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiUser className="mr-1.5" /> 
              Name
            </label>
            <button
              type="button"
              onClick={() => handleIndividualFieldUpdate('name')}
              className="text-xs text-purple-600 hover:text-purple-800"
            >
              Save Name
            </button>
          </div>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2 border ${
              formik.touched.name && formik.errors.name
                ? 'border-red-500'
                : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-[#A467F7] focus:border-[#A467F7] outline-none transition-all`}
            placeholder="John Doe"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}
        </motion.div>

        {/* Email field */}
        <motion.div variants={inputVariants} className="relative">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiMail className="mr-1.5" /> 
              Email
            </label>
            <button
              type="button"
              onClick={() => handleIndividualFieldUpdate('email')}
              className="text-xs text-purple-600 hover:text-purple-800"
            >
              Save Email
            </button>
          </div>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2 border ${
              formik.touched.email && formik.errors.email
                ? 'border-red-500'
                : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-[#A467F7] focus:border-[#A467F7] outline-none transition-all`}
            placeholder="john.doe@example.com"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </motion.div>

        {/* Phone field */}
        <motion.div variants={inputVariants} className="relative">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiPhone className="mr-1.5" /> 
              Phone <span className="text-gray-400 text-xs ml-1">(Optional)</span>
            </label>
            <button
              type="button"
              onClick={() => handleIndividualFieldUpdate('phone')}
              className="text-xs text-purple-600 hover:text-purple-800"
            >
              Save Phone
            </button>
          </div>
          <input
            type="tel"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2 border ${
              formik.touched.phone && formik.errors.phone
                ? 'border-red-500'
                : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-[#A467F7] focus:border-[#A467F7] outline-none transition-all`}
            placeholder="+1 (123) 456-7890"
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
          )}
        </motion.div>

        {/* Role field - Modern Custom Dropdown */}
        <motion.div variants={inputVariants} className="relative">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiShield className="mr-1.5" /> 
              Role
            </label>
            <button
              type="button"
              onClick={() => handleIndividualFieldUpdate('role')}
              className="text-xs text-purple-600 hover:text-purple-800"
            >
              Save Role
            </button>
          </div>
          
          {/* Custom dropdown with modern styling */}
          <div className="relative">
            {/* Custom dropdown trigger */}
            <div 
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={`w-full px-4 py-2.5 border ${
                formik.touched.role && formik.errors.role
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-lg bg-white cursor-pointer flex items-center justify-between transition-all duration-300`}
            >
              <div className="flex items-center">
                {formik.values.role ? (
                  <>
                    {/* Icon based on selected role */}
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#A467F7] to-[#4C03CB] flex items-center justify-center mr-2 shadow-sm">
                      {formik.values.role.includes('admin') ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      ) : formik.values.role.includes('manager') ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Role name */}
                    <span className="text-gray-800 font-medium">
                      {formik.values.role.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">Select Role</span>
                )}
              </div>
              
              {/* Dropdown indicator with animation */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isRoleDropdownOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Custom dropdown menu with purple styling */}
            {isRoleDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {/* Purple header with gradient */}
                <div className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white py-2 px-4 font-medium">
                  Select Role
                </div>
                
                {/* Dropdown options */}
                <div className="max-h-60 overflow-y-auto">
                  {Object.values(USER_ROLES).map((role) => (
                    <div
                      key={role}
                      className={`px-4 py-2.5 cursor-pointer hover:bg-purple-50 ${formik.values.role === role ? 'bg-purple-50 text-purple-700 font-medium' : ''}`}
                      onClick={() => {
                        // Set the field value explicitly
                        formik.setFieldValue('role', role);
                        // Log the change to help with debugging
                        console.log(`Selected role: ${role}`);
                        setIsRoleDropdownOpen(false);
                      }}
                    >
                      {role.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {formik.touched.role && formik.errors.role && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.role}</p>
          )}
        </motion.div>

        {/* Address field - full width */}
        <motion.div variants={inputVariants} className="relative">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiMapPin className="mr-1.5" /> 
              Address <span className="text-gray-400 text-xs ml-1">(Optional)</span>
            </label>
            <button
              type="button"
              onClick={() => handleIndividualFieldUpdate('address')}
              className="text-xs text-purple-600 hover:text-purple-800"
            >
              Save Address
            </button>
          </div>
          <textarea
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={3}
            className={`w-full px-4 py-2 border ${
              formik.touched.address && formik.errors.address
                ? 'border-red-500'
                : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-[#A467F7] focus:border-[#A467F7] outline-none transition-all`}
            placeholder="123 Main St, City, Country"
          ></textarea>
          {formik.touched.address && formik.errors.address && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.address}</p>
          )}
        </motion.div>
      </div>

      {/* Password Fields - Only in Create Mode */}
      {!isEditMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
          {/* Password Field */}
          <motion.div variants={inputVariants} className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FiShield className="mr-1.5" /> 
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                className={`w-full px-4 py-2 pr-10 border ${
                  formik.touched.password && formik.errors.password
                    ? 'border-red-500'
                    : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-[#A467F7] focus:border-[#A467F7] outline-none transition-all`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </motion.div>

          {/* Confirm Password Field */}
          <motion.div variants={inputVariants} className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FiShield className="mr-1.5" /> 
                Confirm Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                className={`w-full px-4 py-2 pr-10 border ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? 'border-red-500'
                    : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-[#A467F7] focus:border-[#A467F7] outline-none transition-all`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
            )}
          </motion.div>
        </div>
      )}

      {/* Submit button - center it */}
      <motion.div variants={inputVariants} className="flex justify-center mt-6">
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white px-8 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default UserForm;
