// src/components/Layout/Header.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { FiMoon, FiSun, FiMenu } from 'react-icons/fi';
import axios from 'axios';

const Header = ({ toggleSidebar }) => {
  const { token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [adminName, setAdminName] = useState('Admin');
  const [adminProfilePic, setAdminProfilePic] = useState(null); // State for profile picture

  useEffect(() => {
    const fetchAdminDetails = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = response.data?.data;
          setAdminName(data?.name || 'Admin');
          setAdminProfilePic(data?.profilePicture || null); // Assuming 'profilePicture' is the key
        } catch (error) {
          console.error('Failed to fetch admin details:', error);
          setAdminName('Admin');
          setAdminProfilePic(null);
        }
      }
    };

    fetchAdminDetails();
  }, [token]);

  return (
    <header className="bg-gradient-to-r from-black to-[#0821D2] dark:bg-gray-800 shadow-md py-4 px-6 flex items-center justify-between">
      {/* Left Section: Toggle Sidebar Button and Logo */}
      <div className="flex items-center space-x-4">
        {/* Toggle Sidebar Button */}
        <button
          onClick={toggleSidebar}
          className="text-white dark:text-gray-200 focus:outline-none"
          title="Toggle Sidebar"
        >
          <FiMenu size={24} />
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="https://res.cloudinary.com/dvbbsgj1u/image/upload/v1731090126/tesnhlpvlo6w9bdjepag.png" // Replace with your actual logo path
            alt="Logo"
            className="w-20 object-contain"
          />
        </div>
      </div>

      {/* Right Section: User Info and Theme Toggle */}
      <div className="flex items-center space-x-6">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          {/* Profile Picture */}
          <img
            src={adminProfilePic || '/assets/default-avatar.png'} // Replace with actual default avatar path
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-white bg-white"
          />
          {/* Welcome Message */}
          <div className="text-md  dark:text-gray-200 text-white uppercase font-bold quantico-bold-italic">
            HI, {adminName}
          </div>
        </div>

        {/* Theme Toggle Button */}
        {/* <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button> */}
      </div>
    </header>
  );
};

export default Header;
