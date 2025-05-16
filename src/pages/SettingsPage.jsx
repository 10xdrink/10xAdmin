// src/pages/SettingsPage.jsx

import React, { useEffect, useState } from 'react';
import Button from '../components/Common/Button';
import toast from 'react-hot-toast';
import settingsService from '../api/settingsService';
import EnlargedX from '../assets/EnlargedX.png'; // Import the logo image

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    theme: 'light', // Example setting
    // Add more settings fields as needed
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch current settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const currentSettings = await settingsService.getSettings();
        setSettings(currentSettings);
      } catch (err) {
        setError(err.message || 'Failed to fetch settings');
        toast.error(`Error fetching settings: ${err.message || err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await settingsService.updateSettings(settings);
      toast.success('Settings updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update settings');
      toast.error(`Failed to update settings: ${err.message || err}`);
    }
  };

  if (loading) return <p>Loading settings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] rounded-lg shadow-xl mb-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="px-6 py-6 md:px-10 w-full md:w-1/2 flex flex-col items-center md:items-start">
            <h1 className="text-4xl font-bold text-white quantico-bold-italic">
              SETTINGS
            </h1>
            <p className="text-blue-100 mt-2 pt-sans-regular">
              Configure system settings efficiently!
            </p>
          </div>
          <div className="hidden md:flex w-full md:w-1/2 h-32 overflow-hidden items-center justify-end mr-24">
            <img
              className="w-32 object-cover transition-transform duration-[2000ms] ease-in-out transform hover:-translate-y-10"
              src={EnlargedX}
              alt="10X Logo"
            />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="My Admin Panel"
              />
            </div>
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                {/* Add more theme options if available */}
              </select>
            </div>
            {/* Add more settings fields as needed */}
            {/* Submit Button */}
            <div>
              <Button type="submit" className="w-full">
                Save Settings
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
