// src/components/Settings/AnalyticsSettings.jsx
import React, { useState } from 'react';

const AnalyticsSettings = ({ 
  settings, 
  onAnalyticsChange, 
  onIntegrationsChange, 
  loading 
}) => {
  const [activeSection, setActiveSection] = useState('analytics');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Analytics & Integration Settings</h2>
        <p className="text-gray-600">Configure analytics tracking and third-party integrations for your store.</p>
      </div>

      {/* Sub-navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveSection('analytics')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'analytics'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Analytics Configuration
        </button>
        <button
          onClick={() => setActiveSection('integrations')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'integrations'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Third-party Integrations
        </button>
      </div>

      {/* Analytics Configuration */}
      {activeSection === 'analytics' && (
        <div className="space-y-6">
          {/* Google Analytics */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Google Analytics</h3>
                <p className="text-sm text-gray-500">Track website traffic and user behavior</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="ga_enabled"
                  checked={settings.analytics.googleAnalytics.enabled}
                  onChange={(e) => onAnalyticsChange({ 
                    googleAnalytics: { 
                      ...settings.analytics.googleAnalytics, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="ga_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.analytics.googleAnalytics.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.analytics.googleAnalytics.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.analytics.googleAnalytics.enabled && (
              <div className="p-4 bg-gray-50">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tracking ID</label>
                  <input
                    type="text"
                    value={settings.analytics.googleAnalytics.trackingId}
                    onChange={(e) => onAnalyticsChange({ 
                      googleAnalytics: { 
                        ...settings.analytics.googleAnalytics, 
                        trackingId: e.target.value 
                      } 
                    })}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter your Google Analytics tracking ID (UA-XXXXXXXXX-X or G-XXXXXXXXXX)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Facebook Pixel */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Facebook Pixel</h3>
                <p className="text-sm text-gray-500">Track conversions from Facebook ads</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="fb_pixel_enabled"
                  checked={settings.analytics.facebookPixel.enabled}
                  onChange={(e) => onAnalyticsChange({ 
                    facebookPixel: { 
                      ...settings.analytics.facebookPixel, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="fb_pixel_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.analytics.facebookPixel.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.analytics.facebookPixel.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.analytics.facebookPixel.enabled && (
              <div className="p-4 bg-gray-50">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pixel ID</label>
                  <input
                    type="text"
                    value={settings.analytics.facebookPixel.pixelId}
                    onChange={(e) => onAnalyticsChange({ 
                      facebookPixel: { 
                        ...settings.analytics.facebookPixel, 
                        pixelId: e.target.value 
                      } 
                    })}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="XXXXXXXXXXXXXXXXXX"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Custom Tracking */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Custom Tracking</h3>
                <p className="text-sm text-gray-500">Add custom tracking scripts</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="custom_tracking_enabled"
                  checked={settings.analytics.customTracking.enabled}
                  onChange={(e) => onAnalyticsChange({ 
                    customTracking: { 
                      ...settings.analytics.customTracking, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="custom_tracking_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.analytics.customTracking.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.analytics.customTracking.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.analytics.customTracking.enabled && (
              <div className="p-4 bg-gray-50">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Script</label>
                  <textarea
                    value={settings.analytics.customTracking.script}
                    onChange={(e) => onAnalyticsChange({ 
                      customTracking: { 
                        ...settings.analytics.customTracking, 
                        script: e.target.value 
                      } 
                    })}
                    disabled={loading}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="<!-- Paste your custom tracking script here -->"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Paste your custom tracking script here. This will be added to the &lt;head&gt; of your website.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Third-party Integrations */}
      {activeSection === 'integrations' && (
        <div className="space-y-6">
          {/* Social Media Integrations */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Integrations</h3>
            <div className="space-y-6">
              {/* Facebook */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-800">Facebook</h4>
                    <p className="text-sm text-gray-500">Connect your Facebook page for social sharing</p>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="facebook_enabled"
                      checked={settings.integrations.socialMedia.facebook.enabled}
                      onChange={(e) => onIntegrationsChange({ 
                        socialMedia: { 
                          ...settings.integrations.socialMedia,
                          facebook: {
                            ...settings.integrations.socialMedia.facebook,
                            enabled: e.target.checked
                          }
                        } 
                      })}
                      disabled={loading}
                      className="sr-only"
                    />
                    <label
                      htmlFor="facebook_enabled"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                        settings.integrations.socialMedia.facebook.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                          settings.integrations.socialMedia.facebook.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                {settings.integrations.socialMedia.facebook.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">App ID</label>
                      <input
                        type="text"
                        value={settings.integrations.socialMedia.facebook.appId}
                        onChange={(e) => onIntegrationsChange({ 
                          socialMedia: { 
                            ...settings.integrations.socialMedia,
                            facebook: {
                              ...settings.integrations.socialMedia.facebook,
                              appId: e.target.value
                            }
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">App Secret</label>
                      <input
                        type="password"
                        value={settings.integrations.socialMedia.facebook.appSecret}
                        onChange={(e) => onIntegrationsChange({ 
                          socialMedia: { 
                            ...settings.integrations.socialMedia,
                            facebook: {
                              ...settings.integrations.socialMedia.facebook,
                              appSecret: e.target.value
                            }
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Instagram */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-800">Instagram</h4>
                    <p className="text-sm text-gray-500">Connect your Instagram account for product sharing</p>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="instagram_enabled"
                      checked={settings.integrations.socialMedia.instagram.enabled}
                      onChange={(e) => onIntegrationsChange({ 
                        socialMedia: { 
                          ...settings.integrations.socialMedia,
                          instagram: {
                            ...settings.integrations.socialMedia.instagram,
                            enabled: e.target.checked
                          }
                        } 
                      })}
                      disabled={loading}
                      className="sr-only"
                    />
                    <label
                      htmlFor="instagram_enabled"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                        settings.integrations.socialMedia.instagram.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                          settings.integrations.socialMedia.instagram.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                {settings.integrations.socialMedia.instagram.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">App ID</label>
                      <input
                        type="text"
                        value={settings.integrations.socialMedia.instagram.appId}
                        onChange={(e) => onIntegrationsChange({ 
                          socialMedia: { 
                            ...settings.integrations.socialMedia,
                            instagram: {
                              ...settings.integrations.socialMedia.instagram,
                              appId: e.target.value
                            }
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">App Secret</label>
                      <input
                        type="password"
                        value={settings.integrations.socialMedia.instagram.appSecret}
                        onChange={(e) => onIntegrationsChange({ 
                          socialMedia: { 
                            ...settings.integrations.socialMedia,
                            instagram: {
                              ...settings.integrations.socialMedia.instagram,
                              appSecret: e.target.value
                            }
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Marketing Integrations */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Marketing Integrations</h3>
            <div className="space-y-6">
              {/* Mailchimp */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-800">Mailchimp</h4>
                    <p className="text-sm text-gray-500">Connect your Mailchimp account for email marketing</p>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="mailchimp_enabled"
                      checked={settings.integrations.marketing.mailchimp.enabled}
                      onChange={(e) => onIntegrationsChange({ 
                        marketing: { 
                          ...settings.integrations.marketing,
                          mailchimp: {
                            ...settings.integrations.marketing.mailchimp,
                            enabled: e.target.checked
                          }
                        } 
                      })}
                      disabled={loading}
                      className="sr-only"
                    />
                    <label
                      htmlFor="mailchimp_enabled"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                        settings.integrations.marketing.mailchimp.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                          settings.integrations.marketing.mailchimp.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                {settings.integrations.marketing.mailchimp.enabled && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                      <input
                        type="password"
                        value={settings.integrations.marketing.mailchimp.apiKey}
                        onChange={(e) => onIntegrationsChange({ 
                          marketing: { 
                            ...settings.integrations.marketing,
                            mailchimp: {
                              ...settings.integrations.marketing.mailchimp,
                              apiKey: e.target.value
                            }
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">List ID</label>
                      <input
                        type="text"
                        value={settings.integrations.marketing.mailchimp.listId}
                        onChange={(e) => onIntegrationsChange({ 
                          marketing: { 
                            ...settings.integrations.marketing,
                            mailchimp: {
                              ...settings.integrations.marketing.mailchimp,
                              listId: e.target.value
                            }
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Klaviyo */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-800">Klaviyo</h4>
                    <p className="text-sm text-gray-500">Connect your Klaviyo account for email marketing</p>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="klaviyo_enabled"
                      checked={settings.integrations.marketing.klaviyo.enabled}
                      onChange={(e) => onIntegrationsChange({ 
                        marketing: { 
                          ...settings.integrations.marketing,
                          klaviyo: {
                            ...settings.integrations.marketing.klaviyo,
                            enabled: e.target.checked
                          }
                        } 
                      })}
                      disabled={loading}
                      className="sr-only"
                    />
                    <label
                      htmlFor="klaviyo_enabled"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                        settings.integrations.marketing.klaviyo.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                          settings.integrations.marketing.klaviyo.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                {settings.integrations.marketing.klaviyo.enabled && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                      <input
                        type="password"
                        value={settings.integrations.marketing.klaviyo.apiKey}
                        onChange={(e) => onIntegrationsChange({ 
                          marketing: { 
                            ...settings.integrations.marketing,
                            klaviyo: {
                              ...settings.integrations.marketing.klaviyo,
                              apiKey: e.target.value
                            }
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">List ID</label>
                      <input
                        type="text"
                        value={settings.integrations.marketing.klaviyo.listId}
                        onChange={(e) => onIntegrationsChange({ 
                          marketing: { 
                            ...settings.integrations.marketing,
                            klaviyo: {
                              ...settings.integrations.marketing.klaviyo,
                              listId: e.target.value
                            }
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsSettings;
