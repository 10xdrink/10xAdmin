// src/components/Settings/AdvancedSettings.jsx
import React, { useState } from 'react';

const AdvancedSettings = ({ 
  settings = {}, 
  onDeveloperSettingsChange, 
  onPerformanceSettingsChange, 
  loading 
}) => {
  // Ensure settings objects exist to prevent errors
  const developerSettings = settings.developerSettings || {};
  const performanceSettings = settings.performanceSettings || {};
  
  // Ensure nested objects exist
  developerSettings.api = developerSettings.api || {};
  developerSettings.webhooks = developerSettings.webhooks || {};
  developerSettings.debugMode = developerSettings.debugMode || {};
  performanceSettings.caching = performanceSettings.caching || {};
  performanceSettings.minification = performanceSettings.minification || {};
  const [activeSection, setActiveSection] = useState('developer');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Advanced Settings</h2>
        <p className="text-gray-600">Configure developer options and performance settings.</p>
      </div>

      {/* Sub-navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveSection('developer')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'developer'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Developer Options
        </button>
        <button
          onClick={() => setActiveSection('performance')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'performance'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Performance Optimization
        </button>
      </div>

      {/* Developer Options */}
      {activeSection === 'developer' && (
        <div className="space-y-6">
          {/* API Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">API Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="enable_api"
                  type="checkbox"
                  checked={developerSettings.api.enabled || false}
                  onChange={(e) => onDeveloperSettingsChange({ 
                    api: { 
                      ...developerSettings.api, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="enable_api" className="ml-2 block text-sm text-gray-700">
                  Enable API Access
                </label>
              </div>
              
              {settings.developerSettings.api.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Rate Limit (requests per minute)</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={developerSettings.api.rateLimit || 60}
                      onChange={(e) => onDeveloperSettingsChange({ 
                        api: { 
                          ...developerSettings.api, 
                          rateLimit: parseInt(e.target.value) || 60 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="require_authentication"
                      type="checkbox"
                      checked={developerSettings.api.requireAuthentication || true}
                      onChange={(e) => onDeveloperSettingsChange({ 
                        api: { 
                          ...developerSettings.api, 
                          requireAuthentication: e.target.checked 
                        } 
                      })}
                      disabled={loading}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="require_authentication" className="ml-2 block text-sm text-gray-700">
                      Require Authentication
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Webhooks */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Webhooks</h3>
                <p className="text-sm text-gray-500">Configure webhooks for system events</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="webhooks_enabled"
                  checked={developerSettings.webhooks.enabled || false}
                  onChange={(e) => onDeveloperSettingsChange({ 
                    webhooks: { 
                      ...developerSettings.webhooks, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="webhooks_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.developerSettings.webhooks.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.developerSettings.webhooks.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {developerSettings.webhooks.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Created Webhook URL</label>
                    <input
                      type="text"
                      value={developerSettings.webhooks.orderCreatedUrl || ''}
                      onChange={(e) => onDeveloperSettingsChange({ 
                        webhooks: { 
                          ...developerSettings.webhooks, 
                          orderCreatedUrl: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="https://example.com/webhook/order-created"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Updated Webhook URL</label>
                    <input
                      type="text"
                      value={developerSettings.webhooks.orderUpdatedUrl || ''}
                      onChange={(e) => onDeveloperSettingsChange({ 
                        webhooks: { 
                          ...developerSettings.webhooks, 
                          orderUpdatedUrl: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="https://example.com/webhook/order-updated"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Registered Webhook URL</label>
                    <input
                      type="text"
                      value={developerSettings.webhooks.userRegisteredUrl || ''}
                      onChange={(e) => onDeveloperSettingsChange({ 
                        webhooks: { 
                          ...developerSettings.webhooks, 
                          userRegisteredUrl: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="https://example.com/webhook/user-registered"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Debug Mode */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Debug Mode</h3>
                <p className="text-sm text-gray-500">Enable detailed error reporting and logging</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="debug_mode_enabled"
                  checked={developerSettings.debugMode.enabled || false}
                  onChange={(e) => onDeveloperSettingsChange({ 
                    debugMode: { 
                      ...developerSettings.debugMode, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="debug_mode_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.developerSettings.debugMode.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.developerSettings.debugMode.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {developerSettings.debugMode.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Log Level</label>
                    <select
                      value={developerSettings.debugMode.logLevel || 'error'}
                      onChange={(e) => onDeveloperSettingsChange({ 
                        debugMode: { 
                          ...developerSettings.debugMode, 
                          logLevel: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="error">Error</option>
                      <option value="warn">Warning</option>
                      <option value="info">Info</option>
                      <option value="debug">Debug</option>
                      <option value="trace">Trace</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="display_errors"
                      type="checkbox"
                      checked={developerSettings.debugMode.displayErrors || false}
                      onChange={(e) => onDeveloperSettingsChange({ 
                        debugMode: { 
                          ...developerSettings.debugMode, 
                          displayErrors: e.target.checked 
                        } 
                      })}
                      disabled={loading}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="display_errors" className="ml-2 block text-sm text-gray-700">
                      Display Errors to Users
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Performance Optimization */}
      {activeSection === 'performance' && (
        <div className="space-y-6">
          {/* Caching */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Caching</h3>
                <p className="text-sm text-gray-500">Configure page and data caching</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="caching_enabled"
                  checked={performanceSettings.caching.enabled || false}
                  onChange={(e) => onPerformanceSettingsChange({ 
                    caching: { 
                      ...performanceSettings.caching, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="caching_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.performanceSettings.caching.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.performanceSettings.caching.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {performanceSettings.caching.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cache Duration (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="1440"
                      value={performanceSettings.caching.duration || 60}
                      onChange={(e) => onPerformanceSettingsChange({ 
                        caching: { 
                          ...performanceSettings.caching, 
                          duration: parseInt(e.target.value) || 60 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="cache_products"
                      type="checkbox"
                      checked={performanceSettings.caching.cacheProducts || true}
                      onChange={(e) => onPerformanceSettingsChange({ 
                        caching: { 
                          ...performanceSettings.caching, 
                          cacheProducts: e.target.checked 
                        } 
                      })}
                      disabled={loading}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="cache_products" className="ml-2 block text-sm text-gray-700">
                      Cache Product Pages
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="cache_categories"
                      type="checkbox"
                      checked={performanceSettings.caching.cacheCategories || true}
                      onChange={(e) => onPerformanceSettingsChange({ 
                        caching: { 
                          ...performanceSettings.caching, 
                          cacheCategories: e.target.checked 
                        } 
                      })}
                      disabled={loading}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="cache_categories" className="ml-2 block text-sm text-gray-700">
                      Cache Category Pages
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="cache_home"
                      type="checkbox"
                      checked={performanceSettings.caching.cacheHome || true}
                      onChange={(e) => onPerformanceSettingsChange({ 
                        caching: { 
                          ...performanceSettings.caching, 
                          cacheHome: e.target.checked 
                        } 
                      })}
                      disabled={loading}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="cache_home" className="ml-2 block text-sm text-gray-700">
                      Cache Home Page
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image Lazy Loading */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Image Lazy Loading</h3>
                <p className="text-sm text-gray-500">Load images only when they enter the viewport</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="lazy_loading_enabled"
                  checked={performanceSettings.lazyLoading || true}
                  onChange={(e) => onPerformanceSettingsChange({ lazyLoading: e.target.checked })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="lazy_loading_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.performanceSettings.lazyLoading ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.performanceSettings.lazyLoading ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
          </div>

          {/* Minification */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Minification</h3>
                <p className="text-sm text-gray-500">Minify HTML, CSS, and JavaScript</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="minification_enabled"
                  checked={performanceSettings.minification.enabled || false}
                  onChange={(e) => onPerformanceSettingsChange({ 
                    minification: { 
                      ...performanceSettings.minification, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="minification_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.performanceSettings.minification.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.performanceSettings.minification.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {performanceSettings.minification.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="minify_html"
                      type="checkbox"
                      checked={performanceSettings.minification.html || true}
                      onChange={(e) => onPerformanceSettingsChange({ 
                        minification: { 
                          ...performanceSettings.minification, 
                          html: e.target.checked 
                        } 
                      })}
                      disabled={loading}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="minify_html" className="ml-2 block text-sm text-gray-700">
                      Minify HTML
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="minify_css"
                      type="checkbox"
                      checked={performanceSettings.minification.css || true}
                      onChange={(e) => onPerformanceSettingsChange({ 
                        minification: { 
                          ...performanceSettings.minification, 
                          css: e.target.checked 
                        } 
                      })}
                      disabled={loading}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="minify_css" className="ml-2 block text-sm text-gray-700">
                      Minify CSS
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="minify_js"
                      type="checkbox"
                      checked={performanceSettings.minification.js || true}
                      onChange={(e) => onPerformanceSettingsChange({ 
                        minification: { 
                          ...performanceSettings.minification, 
                          js: e.target.checked 
                        } 
                      })}
                      disabled={loading}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="minify_js" className="ml-2 block text-sm text-gray-700">
                      Minify JavaScript
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSettings;
