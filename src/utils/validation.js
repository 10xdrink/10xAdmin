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
      .min(2, "Name must be at least 2 characters.")
      .max(50, "Name cannot exceed 50 characters."),
    email: Yup.string()
      .required("Email is required.")
      .email("Invalid email format."),
    role: Yup.string()
      .required("Role is required.") // Changed from optional to required
      .oneOf(Object.values(USER_ROLES), "Invalid user role."),
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

// Add more validation schemas as needed
