// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import authService from '../api/authService';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'; // Ensure you have installed jwt-decode
import toast from 'react-hot-toast';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User object
  const [token, setToken] = useState(null); // JWT token
  const [loading, setLoading] = useState(true); // Loading state
  const [requiresOTP, setRequiresOTP] = useState(false); // OTP requirement state
  const [pendingEmail, setPendingEmail] = useState(null); // Email awaiting OTP
  const navigate = useNavigate();

  // Function to handle logout
  const logout = async () => {
    try {
      await authService.logout(); // Optional: If backend handles logout
      console.log('Logged out successfully.');
    } catch (error) {
      console.error('Logout failed:', error);
      // Proceed to clear auth state even if logout API call fails
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('adminToken');
      navigate('/login'); // Redirect to login page upon logout
      toast.success('Logged out successfully!');
    }
  };

  // On component mount, check if token exists in localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('adminToken');
      if (savedToken) {
        try {
          const decoded = jwt_decode(savedToken);
          console.log('Decoded token on mount:', decoded);
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            console.log('Token expired. Logging out.');
            await logout();
          } else {
            setToken(savedToken);
            setUser({
              name: decoded.name,
              profilePicture: decoded.profilePicture,
              email: decoded.email,
              role: decoded.role,
              id: decoded.id,
            }); // Assuming the token contains user info
            console.log('User authenticated on mount:', decoded);
          }
        } catch (error) {
          console.error('Invalid token:', error);
          await logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', email);
      const response = await authService.login(email, password);
      console.log('Login response:', response);

      if (response.requiresOTP) {
        setRequiresOTP(true);
        setPendingEmail(email);
        toast.success('OTP sent to your email. Please verify to continue.');
        return { requiresOTP: true };
      } else {
        const decoded = jwt_decode(response.token); // Decode token to get user info
        setUser({
          name: decoded.name,
          profilePicture: decoded.profilePicture,
          email: decoded.email,
          role: decoded.role,
          id: decoded.id,
        });
        setToken(response.token);
        localStorage.setItem('adminToken', response.token);
        console.log('Redirecting to dashboard.');
        navigate('/dashboard'); // Redirect to dashboard upon successful login
        toast.success('Logged in successfully!');
        return { requiresOTP: false };
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Check if error.response exists and has data
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error; // Let the component handle the error
    }
  };

  // Verify OTP function
  const verifyOTP = async (email, otp) => {
    try {
      console.log(`Verifying OTP for email: ${email}`);
      const response = await authService.verifyOTP(email, otp);
      console.log('OTP verification response:', response);

      const decoded = jwt_decode(response.token);
      setUser({
        name: decoded.name,
        profilePicture: decoded.profilePicture,
        email: decoded.email,
        role: decoded.role,
        id: decoded.id,
      });
      setToken(response.token);
      localStorage.setItem('adminToken', response.token);
      setRequiresOTP(false);
      setPendingEmail(null);
      console.log('OTP verified. Redirecting to dashboard.');
      navigate('/dashboard'); // Redirect to dashboard upon successful OTP verification
      toast.success('Logged in successfully!');
    } catch (error) {
      console.error('OTP Verification failed:', error);
      const errorMessage =
        error.response?.data?.message ||
        'OTP verification failed. Please try again.';
      toast.error(errorMessage);
      throw error; // Let the component handle the error
    }
  };

  // Resend OTP function (Optional)
  const resendOTP = async (email) => {
    try {
      console.log(`Resending OTP to email: ${email}`);
      await authService.resendOTP(email);
      toast.success('OTP resent to your email.');
      console.log('OTP resent successfully.');
    } catch (error) {
      console.error('Resend OTP failed:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Resend OTP failed. Please try again.';
      toast.error(errorMessage);
      throw error; // Let the component handle the error
    }
  };

  // Automatically logout when the token expires
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        const expiresAt = decoded.exp * 1000; // Convert to milliseconds
        const timeout = expiresAt - Date.now();
        console.log(`Token expires in ${timeout / 1000} seconds.`);
        if (timeout > 0) {
          const timer = setTimeout(() => {
            console.log('Token expired. Logging out.');
            logout();
            toast.info('Session expired. Please log in again.');
          }, timeout);
          return () => clearTimeout(timer);
        } else {
          console.log('Token already expired. Logging out.');
          logout();
        }
      } catch (error) {
        console.error('Token decoding failed:', error);
        logout();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Check if the user is authenticated
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        verifyOTP,
        resendOTP,
        logout,
        loading,
        requiresOTP,
        pendingEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;
