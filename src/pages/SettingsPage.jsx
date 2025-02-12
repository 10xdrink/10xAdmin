// src/pages/SettingsPage.jsx

import React, { useEffect, useState } from 'react';
import useUsers from '../hooks/useUsers'; // Assuming settings are managed via UserContext
import Button from '../components/Common/Button';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { getSettings, updateSettings } = useUsers(); // Ensure these functions are defined in UserContext
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
      try {
        const currentSettings = await getSettings();
        setSettings(currentSettings);
      } catch (err) {
        setError(err);
        toast.error(`Error fetching settings: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [getSettings]);

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
      await updateSettings(settings);
      toast.success('Settings updated successfully.');
    } catch (err) {
      setError(err);
      toast.error(`Failed to update settings: ${err}`);
    }
  };

  if (loading) return <p>Loading settings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
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
  );
};

export default SettingsPage;
