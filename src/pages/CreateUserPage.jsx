// src/pages/CreateUserPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, 
  FiUpload, FiUserPlus, FiShield, FiInfo, FiCheck, 
  FiAlertTriangle, FiX, FiBriefcase, FiArrowRight, FiPhone, FiMapPin
} from 'react-icons/fi';
import { MdAdminPanelSettings, MdSupportAgent, MdAnalytics } from 'react-icons/md';
import { BsBoxSeam, BsFileEarmarkText, BsGear } from 'react-icons/bs';
import { HiOutlineCurrencyDollar, HiOutlineShoppingCart, HiOutlineTag } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';

import { createUser, testCreateUser } from '../services/userService';
import { 
  validateUserForm, 
  calculatePasswordStrength, 
  validatePassword
} from '../utils/validation';
import styles from '../styles/CreateUserPage.module.css';
import { USER_ROLES } from '../constants/userRoles';
import { getAuthToken } from '../utils/auth';
import { login } from '../services/authService';
import Button from '../components/Common/Button';

const CreateUserPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: USER_ROLES.ANALYTICS_VIEWER,
    password: '',
    confirmPassword: '',
    profilePicture: null,
    phone: '',
    address: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [picturePreview, setPicturePreview] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  
  // Form validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [authError, setAuthError] = useState(false);
  
  // Animation states
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  // Calculate password strength whenever password changes
  useEffect(() => {
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(strength);
      
      const validation = validatePassword(formData.password);
      setPasswordFeedback(validation.message);
    } else {
      setPasswordStrength(0);
      setPasswordFeedback('');
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, formData[name]);
  };
  
  const validateField = (name, value) => {
    let errorMessage = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) errorMessage = 'Name is required';
        else if (value.trim().length < 3) errorMessage = 'Name must be at least 3 characters';
        break;
      case 'email':
        if (!value.trim()) {
          errorMessage = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMessage = 'Email is invalid';
        }
        break;
      case 'password':
        const validation = validatePassword(value);
        if (!validation.isValid) {
          errorMessage = validation.message;
        }
        break;
      case 'confirmPassword':
        if (!value) {
          errorMessage = 'Please confirm your password';
        } else if (value !== formData.password) {
          errorMessage = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
    
    return !errorMessage;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step) => {
    let isValid = true;
    
    switch(step) {
      case 1:
        // Validate name and email
        ['name', 'email'].forEach(field => {
          const fieldIsValid = validateField(field, formData[field]);
          if (!fieldIsValid) isValid = false;
          
          setTouched(prev => ({
            ...prev,
            [field]: true
          }));
        });
        break;
      case 2:
        // Role doesn't need validation, just a selection
        isValid = true;
        break;
      case 3:
        // Validate password and confirm password
        ['password', 'confirmPassword'].forEach(field => {
          const fieldIsValid = validateField(field, formData[field]);
          if (!fieldIsValid) isValid = false;
          
          setTouched(prev => ({
            ...prev,
            [field]: true
          }));
        });
        break;
      default:
        break;
    }
    
    return isValid;
  };

  const validateForm = () => {
    const formFields = ['name', 'email', 'password', 'confirmPassword'];
    let isValid = true;
    
    // Check all fields
    formFields.forEach(field => {
      const fieldIsValid = validateField(field, formData[field]);
      if (!fieldIsValid) isValid = false;
      
      // Mark all fields as touched
      setTouched(prev => ({
        ...prev,
        [field]: true
      }));
    });
    
    return isValid;
  };

  // Function to check authentication
  const checkAuthentication = async () => {
    const token = getAuthToken();
    if (!token) {
      console.log('No authentication token found');
      setAuthError(true);
      return false;
    }
    console.log('Authentication token found');
    return true;
  };
  
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setDirection(1);
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      toast.error('Please fix the errors before proceeding');
    }
  };
  
  const handlePrevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    // Check authentication first - skip for testing
    // const isAuthenticated = await checkAuthentication();
    // if (!isAuthenticated) {
    //   toast.error('You must be logged in to create a user. Redirecting to login...');
    //   // Redirect to login after a delay
    //   setTimeout(() => {
    //     navigate('/login');
    //   }, 3000);
    //   return;
    // }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData object to handle file uploads
      const userData = new FormData();
      
      // Always include required fields
      userData.append('name', formData.name);
      userData.append('email', formData.email);
      userData.append('password', formData.password);
      userData.append('role', formData.role);
      
      // Add optional fields if they have values
      if (formData.phone) {
        userData.append('phone', formData.phone);
      }
      
      if (formData.address) {
        userData.append('address', formData.address);
      }
      
      if (formData.profilePicture) {
        userData.append('profilePicture', formData.profilePicture);
      }
      
      // Log the form data before sending
      console.log('Creating user with:', {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        hasPassword: !!formData.password,
        hasProfilePicture: !!formData.profilePicture,
        hasPhone: !!formData.phone,
        hasAddress: !!formData.address
      });
      
      // Verify FormData contents to ensure they're correctly added
      console.log('FormData contents:');
      for (let [key, value] of userData.entries()) {
        console.log(`${key}: ${value instanceof File ? `(File: ${value.name})` : value}`);
      }
      
      const response = await createUser(userData);
      
      // Show success message
      toast.success('User created successfully!');
      showConfetti();
      
      // Short delay before navigation
      setTimeout(() => {
        navigate('/users');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Display a more user-friendly error message
      const errorMessage = error.message || 'Failed to create user. Please try again.';
      toast.error(errorMessage);
      
      // If it's a validation error, highlight the fields with errors
      if (errorMessage.includes('Validation failed')) {
        // Extract field names from the error message
        const fieldsWithErrors = errorMessage
          .replace('Validation failed: ', '')
          .split(', ')
          .map(err => err.split(':')[0]);
        
        // Set those fields as touched and with errors
        fieldsWithErrors.forEach(field => {
          setTouched(prev => ({
            ...prev,
            [field]: true
          }));
          
          // Set a generic error message if the field is identified
          setErrors(prev => ({
            ...prev,
            [field]: `${field} validation failed`
          }));
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to display confetti effect on successful user creation
  const showConfetti = () => {
    const confettiCount = 150;
    const container = document.querySelector(`.${styles.container}`);
    
    if (!container) return;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add(styles.confetti);
      
      // Random confetti styling
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.opacity = Math.random();
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
      confetti.style.animationDelay = `${Math.random() * 2}s`;
      
      container.appendChild(confetti);
      
      // Clean up confetti after animation
      setTimeout(() => {
        if (confetti.parentNode === container) {
          container.removeChild(confetti);
        }
      }, 5000);
    }
  };

  // Get appropriate role icon based on selected role
  const getRoleIcon = (role) => {
    switch (role) {
      case USER_ROLES.SUPER_ADMIN:
        return <MdAdminPanelSettings size={20} />;
      case USER_ROLES.PRODUCT_MANAGER:
        return <BsBoxSeam size={18} />;
      case USER_ROLES.ORDER_MANAGER:
        return <HiOutlineShoppingCart size={18} />;
      case USER_ROLES.CONTENT_MANAGER:
        return <BsFileEarmarkText size={18} />;
      case USER_ROLES.CUSTOMER_SUPPORT_MANAGER:
        return <MdSupportAgent size={18} />;
      case USER_ROLES.MARKETING_MANAGER:
        return <FiBriefcase size={18} />;
      case USER_ROLES.ANALYTICS_VIEWER:
        return <MdAnalytics size={18} />;
      case USER_ROLES.ADMIN_ASSISTANT:
        return <BsGear size={18} />;
      case USER_ROLES.INVENTORY_MANAGER:
        return <BsBoxSeam size={18} />;
      case USER_ROLES.SEO_MANAGER:
        return <BiSearch size={18} />;
      case USER_ROLES.SALES_MANAGER:
        return <HiOutlineCurrencyDollar size={18} />;
      case USER_ROLES.FINANCE_MANAGER:
        return <HiOutlineCurrencyDollar size={18} />;
      default:
        return <FiUser size={18} />;
    }
  };

  // Get role badge class based on role
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case USER_ROLES.SUPER_ADMIN:
        return 'bg-gradient-to-r from-rose-400 to-red-500 text-white';
      case USER_ROLES.PRODUCT_MANAGER:
      case USER_ROLES.INVENTORY_MANAGER:
        return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white';
      case USER_ROLES.ORDER_MANAGER:
        return 'bg-gradient-to-r from-amber-400 to-amber-500 text-white';
      case USER_ROLES.CONTENT_MANAGER:
      case USER_ROLES.SEO_MANAGER:
        return 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white';
      case USER_ROLES.CUSTOMER_SUPPORT_MANAGER:
        return 'bg-gradient-to-r from-sky-400 to-sky-500 text-white';
      case USER_ROLES.MARKETING_MANAGER:
        return 'bg-gradient-to-r from-indigo-400 to-indigo-500 text-white';
      case USER_ROLES.SALES_MANAGER:
        return 'bg-gradient-to-r from-pink-400 to-pink-500 text-white';
      case USER_ROLES.FINANCE_MANAGER:
        return 'bg-gradient-to-r from-green-400 to-green-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const pageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0
    })
  };
  
  const pageTransition = {
    type: "spring",
    stiffness: 200,
    damping: 30
  };

  // Render content based on current step
  const renderStepContent = () => {
    const stepVariants = {
      enter: (direction) => {
        return {
          x: direction > 0 ? 1000 : -1000,
          opacity: 0
        };
      },
      center: {
        x: 0,
        opacity: 1
      },
      exit: (direction) => {
        return {
          x: direction < 0 ? 1000 : -1000,
          opacity: 0
        };
      }
    };

    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
            
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FiUser className="mr-2" />
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border ${
                    touched.name && errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-purple-500 focus:border-purple-500`}
                  placeholder="John Doe"
                />
              </div>
              {touched.name && errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FiMail className="mr-2" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border ${
                    touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-purple-500 focus:border-purple-500`}
                  placeholder="john.doe@example.com"
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            
            {/* Phone Field - Optional */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FiPhone className="mr-2" />
                Phone <span className="text-gray-400 text-xs ml-1">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  placeholder="+1 (123) 456-7890"
                />
              </div>
            </div>
            
            {/* Address Field - Optional */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FiMapPin className="mr-2" />
                Address <span className="text-gray-400 text-xs ml-1">(Optional)</span>
              </label>
              <div className="relative">
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  placeholder="123 Main St, City, Country"
                ></textarea>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">Role & Profile</h2>
            
            {/* Role field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">User Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              >
                <option value={USER_ROLES.ANALYTICS_VIEWER}>Analytics Viewer</option>
                <option value={USER_ROLES.CONTENT_MANAGER}>Content Manager</option>
                <option value={USER_ROLES.CUSTOMER_SUPPORT_MANAGER}>Customer Support Manager</option>
                <option value={USER_ROLES.MARKETING_MANAGER}>Marketing Manager</option>
                <option value={USER_ROLES.ORDER_MANAGER}>Order Manager</option>
                <option value={USER_ROLES.PRODUCT_MANAGER}>Product Manager</option>
                <option value={USER_ROLES.SUPER_ADMIN}>Super Admin</option>
                <option value={USER_ROLES.USER || 'user'}>Regular User</option>
              </select>
            </div>
            
            {/* Profile Picture */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                  {picturePreview ? (
                    <img 
                      src={picturePreview} 
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser size={48} className="text-gray-400" />
                  )}
                </div>
                <label 
                  htmlFor="profilePicture" 
                  className="px-4 py-2 bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white rounded-lg cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <FiUpload />
                  {formData.profilePicture ? 'Change Picture' : 'Upload Picture'}
                </label>
                <input
                  id="profilePicture"
                  name="profilePicture"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {formData.profilePicture && (
                  <p className="text-sm text-gray-500">
                    {formData.profilePicture.name}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">Security</h2>
            
            {/* Password field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 pr-10 border ${
                    touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-purple-500 focus:border-purple-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            
            {/* Confirm Password field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 pr-10 border ${
                    touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-purple-500 focus:border-purple-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-100 rounded-lg">
              <FiShield size={20} className="text-purple-500 mt-0.5" />
              <p className="text-sm text-purple-700">
                Passwords are securely stored. Please use a strong password that you don't use elsewhere.
              </p>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Progress bar for multi-step form
  const renderProgressBar = () => {
    return (
      <div className={styles.progressContainer}>
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div 
              className={`${styles.progressStep} ${currentStep >= step ? styles.active : ''}`}
              onClick={() => {
                if (currentStep > step) {
                  setDirection(-1);
                  setCurrentStep(step);
                } else if (currentStep < step) {
                  if (validateStep(currentStep)) {
                    setDirection(1);
                    setCurrentStep(step);
                  } else {
                    toast.error('Please fix the errors before proceeding');
                  }
                }
              }}
            >
              <span className={styles.stepNumber}>
                {currentStep > step ? <FiCheck size={14} /> : step}
              </span>
              <span className={styles.stepLabel}>
                {step === 1 ? 'Basic Info' : step === 2 ? 'Role & Profile' : 'Security'}
              </span>
            </div>
            {step < 3 && (
              <div 
                className={`${styles.progressLine} ${currentStep > step ? styles.active : ''}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 bg-gray-50 min-h-screen"
    >
      {authError && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center justify-between text-red-800"
        >
          <div className="flex items-center gap-2">
            <FiAlertTriangle size={20} />
            <span>Authentication error. Please log in to create users.</span>
          </div>
          <Button 
            onClick={() => navigate('/login')}
            className="bg-white text-red-600 border border-red-300 hover:bg-red-50 px-4 py-2 rounded-lg"
          >
            Login
          </Button>
        </motion.div>
      )}
      
      {/* Page header */}
      <motion.div variants={itemVariants} className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Create New User</h1>
        
        <Button
          onClick={() => navigate('/users')}
          className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg flex items-center gap-2 transition-all duration-300 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Users
        </Button>
      </motion.div>
      
      {/* Progress bar */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-[#A467F7]' : 'text-gray-400'}`}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full shadow-md mb-2 ${currentStep >= 1 ? 'bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white' : 'bg-gray-100 text-gray-400'}`}>
              <span>1</span>
            </div>
            <span className="text-sm font-medium">Basic Info</span>
          </div>
          
          <div className={`h-1 w-24 md:w-32 ${currentStep >= 2 ? 'bg-gradient-to-r from-[#A467F7] to-[#4C03CB]' : 'bg-gray-200'}`}></div>
          
          <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-[#A467F7]' : 'text-gray-400'}`}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full shadow-md mb-2 ${currentStep >= 2 ? 'bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white' : 'bg-gray-100 text-gray-400'}`}>
              <span>2</span>
            </div>
            <span className="text-sm font-medium">Role & Profile</span>
          </div>
          
          <div className={`h-1 w-24 md:w-32 ${currentStep >= 3 ? 'bg-gradient-to-r from-[#A467F7] to-[#4C03CB]' : 'bg-gray-200'}`}></div>
          
          <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-[#A467F7]' : 'text-gray-400'}`}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full shadow-md mb-2 ${currentStep >= 3 ? 'bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white' : 'bg-gray-100 text-gray-400'}`}>
              <span>3</span>
            </div>
            <span className="text-sm font-medium">Security</span>
          </div>
        </div>
      </motion.div>
      
      {/* Main content */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div 
          variants={itemVariants}
          className="col-span-2 bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-6">
            {/* Step content */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="min-h-[400px]"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-8">
              {currentStep > 1 ? (
                <Button
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Previous
                </Button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 3 ? (
                <Button
                  onClick={handleNextStep}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating User...
                    </>
                  ) : (
                    <>
                      Create User
                      <FiUserPlus size={18} />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Preview panel */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] p-4">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <FiUser className="mr-2" />
              User Preview
            </h3>
          </div>
          <div className="p-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg mb-4">
              {picturePreview ? (
                <img 
                  src={picturePreview} 
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser size={48} className="text-gray-400" />
              )}
      </div>
            
            <h2 className="text-xl font-bold text-gray-800 mt-2">
              {formData.name || 'New User'}
            </h2>
            <p className="text-gray-500 mb-4">
              {formData.email || 'user@example.com'}
            </p>
            
            <div className={`text-sm font-medium px-3 py-1 rounded-full ${getRoleBadgeClass(formData.role)}`}>
              {getRoleIcon(formData.role)}
              {formData.role === USER_ROLES.SUPER_ADMIN ? 'Super Admin' : 
               formData.role === USER_ROLES.PRODUCT_MANAGER ? 'Product Manager' :
               formData.role === USER_ROLES.CONTENT_MANAGER ? 'Content Manager' :
               formData.role === USER_ROLES.CUSTOMER_SUPPORT_MANAGER ? 'Support Manager' :
               formData.role === USER_ROLES.MARKETING_MANAGER ? 'Marketing Manager' :
               formData.role === USER_ROLES.ORDER_MANAGER ? 'Order Manager' :
               formData.role === USER_ROLES.FINANCE_MANAGER ? 'Finance Manager' :
               formData.role === USER_ROLES.ANALYTICS_VIEWER ? 'Analytics Viewer' : 
               'Regular User'}
      </div>
    </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CreateUserPage;
