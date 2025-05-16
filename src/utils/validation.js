// src/utils/validation.js

import * as Yup from "yup";
import { USER_ROLES } from "./constants";

/**
 * Validation schema for login form.
 */
export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

/**
 * Validation schema for the UserForm.
 * Includes conditional validation for password fields based on whether it's in create mode.
 * @param {boolean} isEditMode - Determines if the form is in edit mode.
 */
export const userFormValidationSchema = (isEditMode = false) =>
  Yup.object().shape({
    name: Yup.string()
      .required("Name is required.")
      .min(3, "Name must be at least 3 characters.")
      .max(50, "Name cannot exceed 50 characters."),
    email: Yup.string()
      .required("Email is required.")
      .email("Invalid email format."),
    role: Yup.string()
      .required("Role is required.") // Changed from optional to required
      .oneOf(Object.values(USER_ROLES), "Invalid user role."),
    // Add phone and address fields as optional
    phone: Yup.string()
      .nullable()
      .max(20, "Phone number cannot exceed 20 characters"),
    address: Yup.string()
      .nullable()
      .max(200, "Address cannot exceed 200 characters"),
    profilePicture: Yup.mixed()
      .nullable()
      .test(
        "fileSize",
        "File size is too large.",
        (value) => !value || (value && value.size <= 5 * 1024 * 1024) // 5MB
      )
      .test(
        "fileFormat",
        "Unsupported file format.",
        (value) =>
          !value ||
          (value &&
            ["image/jpg", "image/jpeg", "image/png", "image/gif"].includes(
              value.type
            ))
      ),
    // Conditionally add password fields if not in edit mode
    ...(isEditMode
      ? {}
      : {
          password: Yup.string()
            .required("Password is required.")
            .min(8, "Password must be at least 8 characters.")
            .matches(
              /(?=.*[A-Z])/,
              "Password must contain at least one uppercase letter."
            )
            .matches(/(?=.*\d)/, "Password must contain at least one number.")
            .matches(
              /(?=.*[@$!%*?&])/,
              "Password must contain at least one special character."
            ),
          confirmPassword: Yup.string()
            .required("Please confirm your password.")
            .oneOf([Yup.ref("password"), null], "Passwords must match."),
        }),
  });

/**
 * Validation schema for inviting a user.
 */
export const inviteUserValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  role: Yup.string()
    .oneOf(Object.values(USER_ROLES), "Invalid role")
    .required("Role is required"),
});

// Validation schema for OTP verification
export const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

/**
 * Validation schema for password reset.
 */
export const resetPasswordValidationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*#?&]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

/**
 * Validates an email address format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {Object} - Object containing validity and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (!hasUpperCase) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!hasLowerCase) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!hasNumbers) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (!hasSpecialChar) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, message: 'Password is strong' };
};

/**
 * Validates that passwords match
 * @param {string} password - The original password
 * @param {string} confirmPassword - The confirmation password
 * @returns {boolean} - True if matching, false otherwise
 */
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validates a name field
 * @param {string} name - The name to validate
 * @returns {Object} - Object containing validity and message
 */
export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return { isValid: false, message: 'Name is required' };
  }
  
  if (name.length < 3) {
    return { isValid: false, message: 'Name must be at least 3 characters long' };
  }
  
  if (name.length > 50) {
    return { isValid: false, message: 'Name must be less than 50 characters' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validates form fields for user creation
 * @param {Object} userData - The user data to validate
 * @returns {Object} - Object containing isValid flag and errors object
 */
export const validateUserForm = (userData) => {
  const errors = {};
  
  // Validate name
  const nameValidation = validateName(userData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }
  
  // Validate email
  if (!userData.email || !isValidEmail(userData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Validate role
  if (!userData.role) {
    errors.role = 'Please select a role';
  }
  
  // Validate password
  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }
  
  // Validate password confirmation
  if (!doPasswordsMatch(userData.password, userData.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Calculates password strength as a percentage
 * @param {string} password - The password to evaluate
 * @returns {number} - Strength percentage (0-100)
 */
export const calculatePasswordStrength = (password) => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length contribution (up to 25%)
  strength += Math.min(25, Math.floor(password.length * 2.5));
  
  // Character variety contribution (up to 75%)
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[a-z]/.test(password)) strength += 15;
  if (/\d/.test(password)) strength += 15;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 15;
  if (/[\w\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{3,}/.test(password)) strength += 15;
  
  return Math.min(100, strength);
};

// Add more validation schemas as needed
