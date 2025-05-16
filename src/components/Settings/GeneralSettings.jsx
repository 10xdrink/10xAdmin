// src/components/Settings/GeneralSettings.jsx
import React, { useState } from 'react';

const GeneralSettings = ({ 
  settings, 
  onCompanyInfoChange, 
  onRegionalChange, 
  onUiChange, 
  loading 
}) => {
  const [activeSection, setActiveSection] = useState('company');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">General Settings</h2>
        <p className="text-gray-600">Configure basic information about your store and customize the admin interface.</p>
      </div>

      {/* Sub-navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveSection('company')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'company'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Company Information
        </button>
        <button
          onClick={() => setActiveSection('regional')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'regional'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Regional Settings
        </button>
        <button
          onClick={() => setActiveSection('ui')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'ui'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          UI Customization
        </button>
      </div>

      {/* Company Information */}
      {activeSection === 'company' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={settings.companyInfo.name}
                onChange={(e) => onCompanyInfoChange({ name: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="10X Drinks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={settings.companyInfo.email}
                onChange={(e) => onCompanyInfoChange({ email: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="contact@10xdrinks.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={settings.companyInfo.phone}
                onChange={(e) => onCompanyInfoChange({ phone: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
              <input
                type="text"
                value={settings.companyInfo.businessHours}
                onChange={(e) => onCompanyInfoChange({ businessHours: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={settings.companyInfo.address}
              onChange={(e) => onCompanyInfoChange({ address: e.target.value })}
              disabled={loading}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="123 Business Street, City, State, PIN"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-800 mb-3">Logo & Favicon</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <div className="flex">
                  <input
                    type="text"
                    value={settings.companyInfo.logo}
                    onChange={(e) => onCompanyInfoChange({ logo: e.target.value })}
                    disabled={loading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="https://example.com/logo.png"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Browse
                  </button>
                </div>
                {settings.companyInfo.logo && (
                  <div className="mt-2 p-2 border border-gray-200 rounded-md inline-block">
                    <img 
                      src={settings.companyInfo.logo} 
                      alt="Company Logo" 
                      className="h-12 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150x50?text=Invalid+Logo+URL';
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
                <div className="flex">
                  <input
                    type="text"
                    value={settings.companyInfo.favicon}
                    onChange={(e) => onCompanyInfoChange({ favicon: e.target.value })}
                    disabled={loading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="https://example.com/favicon.ico"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Browse
                  </button>
                </div>
                {settings.companyInfo.favicon && (
                  <div className="mt-2 p-2 border border-gray-200 rounded-md inline-block">
                    <img 
                      src={settings.companyInfo.favicon} 
                      alt="Favicon" 
                      className="h-8 w-8 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/32?text=X';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-800 mb-3">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <input
                  type="url"
                  value={settings.companyInfo.socialMedia.facebook}
                  onChange={(e) => onCompanyInfoChange({ 
                    socialMedia: { 
                      ...settings.companyInfo.socialMedia, 
                      facebook: e.target.value 
                    } 
                  })}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="https://facebook.com/10xdrinks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <input
                  type="url"
                  value={settings.companyInfo.socialMedia.instagram}
                  onChange={(e) => onCompanyInfoChange({ 
                    socialMedia: { 
                      ...settings.companyInfo.socialMedia, 
                      instagram: e.target.value 
                    } 
                  })}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="https://instagram.com/10xdrinks"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                <input
                  type="url"
                  value={settings.companyInfo.socialMedia.twitter}
                  onChange={(e) => onCompanyInfoChange({ 
                    socialMedia: { 
                      ...settings.companyInfo.socialMedia, 
                      twitter: e.target.value 
                    } 
                  })}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="https://twitter.com/10xdrinks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
                <input
                  type="url"
                  value={settings.companyInfo.socialMedia.youtube}
                  onChange={(e) => onCompanyInfoChange({ 
                    socialMedia: { 
                      ...settings.companyInfo.socialMedia, 
                      youtube: e.target.value 
                    } 
                  })}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="https://youtube.com/c/10xdrinks"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regional Settings */}
      {activeSection === 'regional' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
              <select
                value={settings.regional.currency}
                onChange={(e) => onRegionalChange({ currency: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="JPY">Japanese Yen (¥)</option>
                <option value="AUD">Australian Dollar (A$)</option>
                <option value="CAD">Canadian Dollar (C$)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
              <select
                value={settings.regional.language}
                onChange={(e) => onRegionalChange({ language: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="mr">Marathi</option>
                <option value="bn">Bengali</option>
                <option value="gu">Gujarati</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
              <select
                value={settings.regional.dateFormat}
                onChange={(e) => onRegionalChange({ dateFormat: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2023)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2023)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2023-12-31)</option>
                <option value="DD-MMM-YYYY">DD-MMM-YYYY (31-Dec-2023)</option>
                <option value="MMM DD, YYYY">MMM DD, YYYY (Dec 31, 2023)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
              <select
                value={settings.regional.timeFormat}
                onChange={(e) => onRegionalChange({ timeFormat: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="24h">24-hour (14:30)</option>
                <option value="12h">12-hour (2:30 PM)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              value={settings.regional.timezone}
              onChange={(e) => onRegionalChange({ timezone: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="Asia/Kolkata">India Standard Time (UTC+5:30)</option>
              <option value="UTC">Coordinated Universal Time (UTC)</option>
              <option value="America/New_York">Eastern Time (UTC-5/UTC-4)</option>
              <option value="America/Los_Angeles">Pacific Time (UTC-8/UTC-7)</option>
              <option value="Europe/London">British Time (UTC+0/UTC+1)</option>
              <option value="Europe/Paris">Central European Time (UTC+1/UTC+2)</option>
              <option value="Asia/Tokyo">Japan Standard Time (UTC+9)</option>
              <option value="Australia/Sydney">Australian Eastern Time (UTC+10/UTC+11)</option>
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-800 mb-3">Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                <p className="text-base font-medium">
                  {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Currency</p>
                <p className="text-base font-medium">
                  {settings.regional.currency === 'INR' ? '₹' : 
                   settings.regional.currency === 'USD' ? '$' : 
                   settings.regional.currency === 'EUR' ? '€' : 
                   settings.regional.currency === 'GBP' ? '£' : 
                   settings.regional.currency === 'JPY' ? '¥' : 
                   settings.regional.currency === 'AUD' ? 'A$' : 
                   settings.regional.currency === 'CAD' ? 'C$' : '₹'} 1,234.56
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UI Customization */}
      {activeSection === 'ui' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select
                value={settings.ui.theme}
                onChange={(e) => onUiChange({ theme: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (follow system)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color Scheme</label>
              <select
                value={settings.ui.colorScheme}
                onChange={(e) => onUiChange({ colorScheme: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="default">Default (Purple)</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
                <option value="orange">Orange</option>
                <option value="teal">Teal</option>
                <option value="pink">Pink</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dashboard Layout</label>
            <select
              value={settings.ui.dashboardLayout}
              onChange={(e) => onUiChange({ dashboardLayout: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="default">Default</option>
              <option value="compact">Compact</option>
              <option value="expanded">Expanded</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom CSS</label>
            <textarea
              value={settings.ui.customCSS}
              onChange={(e) => onUiChange({ customCSS: e.target.value })}
              disabled={loading}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="/* Add your custom CSS here */
.sidebar { background-color: #f8f9fa; }
.header { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }"
            />
            <p className="mt-1 text-sm text-gray-500">
              Advanced: Add custom CSS to override the default styles of the admin panel.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-800 mb-3">Theme Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border ${settings.ui.theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                <h4 className={`text-sm font-medium mb-2 ${settings.ui.theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Light Theme</h4>
                <div className="flex space-x-2">
                  <div className={`w-6 h-6 rounded-full ${settings.ui.colorScheme === 'default' ? 'bg-indigo-500' : 
                    settings.ui.colorScheme === 'blue' ? 'bg-blue-500' : 
                    settings.ui.colorScheme === 'green' ? 'bg-green-500' : 
                    settings.ui.colorScheme === 'red' ? 'bg-red-500' : 
                    settings.ui.colorScheme === 'orange' ? 'bg-orange-500' : 
                    settings.ui.colorScheme === 'teal' ? 'bg-teal-500' : 
                    settings.ui.colorScheme === 'pink' ? 'bg-pink-500' : 'bg-indigo-500'}`}>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                </div>
              </div>
              <div className={`p-4 rounded-lg border ${settings.ui.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h4 className={`text-sm font-medium mb-2 ${settings.ui.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Dark Theme</h4>
                <div className="flex space-x-2">
                  <div className={`w-6 h-6 rounded-full ${settings.ui.colorScheme === 'default' ? 'bg-indigo-500' : 
                    settings.ui.colorScheme === 'blue' ? 'bg-blue-500' : 
                    settings.ui.colorScheme === 'green' ? 'bg-green-500' : 
                    settings.ui.colorScheme === 'red' ? 'bg-red-500' : 
                    settings.ui.colorScheme === 'orange' ? 'bg-orange-500' : 
                    settings.ui.colorScheme === 'teal' ? 'bg-teal-500' : 
                    settings.ui.colorScheme === 'pink' ? 'bg-pink-500' : 'bg-indigo-500'}`}>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                  <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                </div>
              </div>
              <div className={`p-4 rounded-lg border ${settings.ui.theme === 'auto' ? 'bg-gradient-to-r from-white to-gray-800 border-gray-400' : 'bg-white border-gray-200'}`}>
                <h4 className={`text-sm font-medium mb-2 ${settings.ui.theme === 'auto' ? 'text-gray-800' : 'text-gray-800'}`}>Auto Theme</h4>
                <div className="flex space-x-2">
                  <div className={`w-6 h-6 rounded-full ${settings.ui.colorScheme === 'default' ? 'bg-indigo-500' : 
                    settings.ui.colorScheme === 'blue' ? 'bg-blue-500' : 
                    settings.ui.colorScheme === 'green' ? 'bg-green-500' : 
                    settings.ui.colorScheme === 'red' ? 'bg-red-500' : 
                    settings.ui.colorScheme === 'orange' ? 'bg-orange-500' : 
                    settings.ui.colorScheme === 'teal' ? 'bg-teal-500' : 
                    settings.ui.colorScheme === 'pink' ? 'bg-pink-500' : 'bg-indigo-500'}`}>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                  <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralSettings;
