// src/components/Settings/UserSecuritySettings.jsx
import React, { useState } from 'react';

const UserSecuritySettings = ({ 
  settings, 
  onUserManagementChange, 
  onSecuritySettingsChange, 
  loading 
}) => {
  const [activeSection, setActiveSection] = useState('user');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">User & Security Settings</h2>
        <p className="text-gray-600">Configure user roles, permissions, and security settings for your store.</p>
      </div>

      {/* Sub-navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveSection('user')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'user'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveSection('security')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'security'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Security Settings
        </button>
        <button
          onClick={() => setActiveSection('privacy')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'privacy'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Privacy Settings
        </button>
      </div>

      {/* User Management */}
      {activeSection === 'user' && (
        <div className="space-y-6">
          {/* User Roles */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">User Roles & Permissions</h3>
              <p className="text-sm text-gray-500">Configure access levels for different user roles</p>
            </div>
            <div className="divide-y divide-gray-200">
              {Object.entries(settings.userManagement.roles).map(([role, config]) => (
                <div key={role} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-md font-medium text-gray-800 capitalize">{role}</h4>
                      <p className="text-sm text-gray-500">
                        {role === 'admin' && 'Full access to all features'}
                        {role === 'manager' && 'Can manage most aspects except user roles and security settings'}
                        {role === 'editor' && 'Can create and edit content but cannot delete'}
                        {role === 'viewer' && 'Read-only access to view data'}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={loading || role === 'admin'} // Admin role cannot be edited
                      className={`px-3 py-1 ${role === 'admin' ? 'bg-gray-100 text-gray-500' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
                    >
                      Edit Permissions
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add New Role
              </button>
            </div>
          </div>

          {/* Password Policy */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Password Policy</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
                <input
                  type="number"
                  min="6"
                  max="32"
                  value={settings.userManagement.passwordPolicy.minLength}
                  onChange={(e) => onUserManagementChange({ 
                    passwordPolicy: { 
                      ...settings.userManagement.passwordPolicy, 
                      minLength: parseInt(e.target.value) || 8 
                    } 
                  })}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="require_uppercase"
                    checked={settings.userManagement.passwordPolicy.requireUppercase}
                    onChange={(e) => onUserManagementChange({ 
                      passwordPolicy: { 
                        ...settings.userManagement.passwordPolicy, 
                        requireUppercase: e.target.checked 
                      } 
                    })}
                    disabled={loading}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="require_uppercase" className="ml-2 block text-sm text-gray-700">
                    Require uppercase letters
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="require_lowercase"
                    checked={settings.userManagement.passwordPolicy.requireLowercase}
                    onChange={(e) => onUserManagementChange({ 
                      passwordPolicy: { 
                        ...settings.userManagement.passwordPolicy, 
                        requireLowercase: e.target.checked 
                      } 
                    })}
                    disabled={loading}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="require_lowercase" className="ml-2 block text-sm text-gray-700">
                    Require lowercase letters
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="require_numbers"
                    checked={settings.userManagement.passwordPolicy.requireNumbers}
                    onChange={(e) => onUserManagementChange({ 
                      passwordPolicy: { 
                        ...settings.userManagement.passwordPolicy, 
                        requireNumbers: e.target.checked 
                      } 
                    })}
                    disabled={loading}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="require_numbers" className="ml-2 block text-sm text-gray-700">
                    Require numbers
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="require_special_chars"
                    checked={settings.userManagement.passwordPolicy.requireSpecialChars}
                    onChange={(e) => onUserManagementChange({ 
                      passwordPolicy: { 
                        ...settings.userManagement.passwordPolicy, 
                        requireSpecialChars: e.target.checked 
                      } 
                    })}
                    disabled={loading}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="require_special_chars" className="ml-2 block text-sm text-gray-700">
                    Require special characters
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to user accounts</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="two_factor_enabled"
                  checked={settings.userManagement.twoFactorAuth.enabled}
                  onChange={(e) => onUserManagementChange({ 
                    twoFactorAuth: { 
                      ...settings.userManagement.twoFactorAuth, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="two_factor_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.userManagement.twoFactorAuth.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.userManagement.twoFactorAuth.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.userManagement.twoFactorAuth.enabled && (
              <div className="p-4 bg-gray-50">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Authentication Method</label>
                  <select
                    value={settings.userManagement.twoFactorAuth.method}
                    onChange={(e) => onUserManagementChange({ 
                      twoFactorAuth: { 
                        ...settings.userManagement.twoFactorAuth, 
                        method: e.target.value 
                      } 
                    })}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="app">Authenticator App</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Session Timeout */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Session Timeout</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Automatically log out after inactivity (minutes)</label>
              <input
                type="number"
                min="5"
                max="1440"
                value={settings.userManagement.sessionTimeout}
                onChange={(e) => onUserManagementChange({ 
                  sessionTimeout: parseInt(e.target.value) || 60 
                })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="mt-1 text-sm text-gray-500">
                Set to 0 to disable session timeout.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeSection === 'security' && (
        <div className="space-y-6">
          {/* CAPTCHA Settings */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">CAPTCHA Protection</h3>
                <p className="text-sm text-gray-500">Protect forms from spam and bot submissions</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="captcha_enabled"
                  checked={settings.securitySettings.captcha.enabled}
                  onChange={(e) => onSecuritySettingsChange({ 
                    captcha: { 
                      ...settings.securitySettings.captcha, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="captcha_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.securitySettings.captcha.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.securitySettings.captcha.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.securitySettings.captcha.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Key</label>
                    <input
                      type="text"
                      value={settings.securitySettings.captcha.siteKey}
                      onChange={(e) => onSecuritySettingsChange({ 
                        captcha: { 
                          ...settings.securitySettings.captcha, 
                          siteKey: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="6LdXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                    <input
                      type="password"
                      value={settings.securitySettings.captcha.secretKey}
                      onChange={(e) => onSecuritySettingsChange({ 
                        captcha: { 
                          ...settings.securitySettings.captcha, 
                          secretKey: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="••••••••••••••••••••••••"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Login Attempts */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Login Attempt Limits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Login Attempts</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.securitySettings.loginAttempts.max}
                  onChange={(e) => onSecuritySettingsChange({ 
                    loginAttempts: { 
                      ...settings.securitySettings.loginAttempts, 
                      max: parseInt(e.target.value) || 5 
                    } 
                  })}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lockout Time (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="1440"
                  value={settings.securitySettings.loginAttempts.lockoutTime}
                  onChange={(e) => onSecuritySettingsChange({ 
                    loginAttempts: { 
                      ...settings.securitySettings.loginAttempts, 
                      lockoutTime: parseInt(e.target.value) || 30 
                    } 
                  })}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* IP Blocking */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">IP Blocking</h3>
                <p className="text-sm text-gray-500">Block access from specific IP addresses</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="ip_blocking_enabled"
                  checked={settings.securitySettings.ipBlocking.enabled}
                  onChange={(e) => onSecuritySettingsChange({ 
                    ipBlocking: { 
                      ...settings.securitySettings.ipBlocking, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="ip_blocking_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.securitySettings.ipBlocking.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.securitySettings.ipBlocking.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.securitySettings.ipBlocking.enabled && (
              <div className="p-4 bg-gray-50">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blocked IP Addresses</label>
                  <textarea
                    value={settings.securitySettings.ipBlocking.blockedIPs.join('\n')}
                    onChange={(e) => onSecuritySettingsChange({ 
                      ipBlocking: { 
                        ...settings.securitySettings.ipBlocking, 
                        blockedIPs: e.target.value.split('\n').filter(ip => ip.trim() !== '') 
                      } 
                    })}
                    disabled={loading}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter one IP address per line"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter one IP address per line. You can also use CIDR notation (e.g., 192.168.1.0/24).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* API Access Tokens */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">API Access Tokens</h3>
                <p className="text-sm text-gray-500">Manage API access for third-party integrations</p>
              </div>
              <button
                type="button"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Manage API Tokens
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings */}
      {activeSection === 'privacy' && (
        <div className="space-y-6">
          {/* Cookie Consent */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cookie Consent</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="cookie_consent"
                  checked={true}
                  disabled={loading}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="cookie_consent" className="ml-2 block text-sm text-gray-700">
                  Enable cookie consent banner
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cookie Consent Text</label>
                <textarea
                  value="This website uses cookies to ensure you get the best experience on our website. By continuing to use this site, you consent to our use of cookies."
                  disabled={loading}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="cookie_advanced"
                  checked={true}
                  disabled={loading}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="cookie_advanced" className="ml-2 block text-sm text-gray-700">
                  Allow users to customize cookie preferences
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Policy</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Privacy Policy URL</label>
              <input
                type="url"
                value="/privacy-policy"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="https://example.com/privacy-policy"
              />
            </div>
            <div className="mt-4">
              <button
                type="button"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit Privacy Policy
              </button>
            </div>
          </div>

          {/* Data Retention */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Data Retention</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Data Retention Period (days)</label>
                <input
                  type="number"
                  min="30"
                  value="730"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="mt-1 text-sm text-gray-500">
                  How long to keep customer data after account deletion. Minimum 30 days.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Data Retention Period (days)</label>
                <input
                  type="number"
                  min="365"
                  value="3650"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="mt-1 text-sm text-gray-500">
                  How long to keep order data. Minimum 365 days for legal compliance.
                </p>
              </div>
            </div>
          </div>

          {/* GDPR Compliance */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">GDPR Compliance</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="gdpr_enabled"
                  checked={true}
                  disabled={loading}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="gdpr_enabled" className="ml-2 block text-sm text-gray-700">
                  Enable GDPR compliance features
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="data_export"
                  checked={true}
                  disabled={loading}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="data_export" className="ml-2 block text-sm text-gray-700">
                  Allow users to export their data
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="data_deletion"
                  checked={true}
                  disabled={loading}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="data_deletion" className="ml-2 block text-sm text-gray-700">
                  Allow users to request account deletion
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSecuritySettings;
