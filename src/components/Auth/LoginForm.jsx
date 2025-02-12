// src/components/Auth/LoginForm.jsx

import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useFormik } from "formik";
import { loginValidationSchema, otpValidationSchema } from "../../utils/validation"; // Ensure both are imported
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import logo from "../../assets/10X Logo.webp";

const LoginForm = () => {
  const { login, verifyOTP, resendOTP, requiresOTP, pendingEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  // Formik for login
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const result = await login(values.email, values.password);
        if (result.requiresOTP) {
          toast.success("OTP sent to your email. Please verify to continue.");
        } else {
          toast.success("Logged in successfully!");
        }
      } catch (error) {
        // Error handling is already managed in AuthContext
      } finally {
        setLoading(false);
      }
    },
  });

  // Formik for OTP
  const otpFormik = useFormik({
    initialValues: { otp: "" },
    validationSchema: otpValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await verifyOTP(pendingEmail, values.otp);
        toast.success("Logged in successfully!");
      } catch (error) {
        // Error handling is already managed in AuthContext
      } finally {
        setLoading(false);
      }
    },
  });

  // Handler for Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await resendOTP(pendingEmail);
      toast.success("OTP resent to your email.");
    } catch (error) {
      // Error handling is already managed in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-black to-[#0821D2] justify-center flex py-6">
        <img className="w-20" src={logo} alt="Logo" />
      </div>

      <form
        onSubmit={requiresOTP ? otpFormik.handleSubmit : formik.handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg p-8"
      >
        <h2 className="font-bold uppercase text-center text-gray-800 dark:text-white mb-6 text-4xl quantico-bold-italic">
          {requiresOTP ? "OTP Verification" : "ADMIN LOGIN"}
        </h2>

        {!requiresOTP ? (
          <>
            {/* Email Field */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-black dark:text-gray-300 mb-2 pt-sans-regular"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`w-full px-4 py-3 border pt-sans-regular text-black ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter your email"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6 relative">
              <label
                htmlFor="password"
                className="block text-black dark:text-gray-300 mb-2 pt-sans-regular"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`w-full px-4 py-3 border pt-sans-regular text-black ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter your password"
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer mt-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* OTP Field */}
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-black dark:text-gray-300 mb-2 pt-sans-regular" 
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                onChange={otpFormik.handleChange}
                onBlur={otpFormik.handleBlur}
                value={otpFormik.values.otp}
                className={`w-full px-4 py-3 border pt-sans-regular text-black ${
                  otpFormik.touched.otp && otpFormik.errors.otp
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter the OTP sent to your email"
              />
              {otpFormik.touched.otp && otpFormik.errors.otp && (
                <p className="text-red-500 text-sm mt-1">{otpFormik.errors.otp}</p>
              )}
            </div>

            {/* Resend OTP Button */}
            <div className="mb-6 text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-blue-500 hover:underline text-sm"
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-black to-[#0821D2] text-white py-3 px-4 uppercase text-xl transition duration-300 disabled:opacity-50 quantico-bold-italic"
          >
            {loading
              ? requiresOTP
                ? "Verifying OTP..."
                : "Logging in..."
              : requiresOTP
              ? "Verify OTP"
              : "Login"}
          </button>
        </div>

        {!requiresOTP && (
          <>
            {/* Forgot Password Link */}
            <div className="text-center mb-4">
              <a
                href="/forgot-password"
                className="text-sm text-gray-700 dark:text-gray-300 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default LoginForm;
