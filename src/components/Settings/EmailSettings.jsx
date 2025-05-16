// src/components/Settings/EmailSettings.jsx
import React, { useState } from 'react';

const EmailSettings = ({ 
  settings, 
  onEmailTemplatesChange, 
  onNotificationRulesChange, 
  onAutomatedEmailsChange, 
  loading 
}) => {
  const [activeSection, setActiveSection] = useState('templates');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Email & Notification Settings</h2>
        <p className="text-gray-600">Configure email templates and notification preferences for your store.</p>
      </div>

      {/* Sub-navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveSection('templates')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'templates'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Email Templates
        </button>
        <button
          onClick={() => setActiveSection('notifications')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'notifications'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Notification Rules
        </button>
        <button
          onClick={() => setActiveSection('automated')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'automated'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Automated Emails
        </button>
      </div>

      {/* Email Templates */}
      {activeSection === 'templates' && (
        <div className="space-y-6">
          {/* Template List */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Email Templates</h3>
              <p className="text-sm text-gray-500">Customize email templates sent to customers</p>
            </div>
            <div className="divide-y divide-gray-200">
              {Object.entries(settings.emailTemplates).map(([key, template]) => (
                <div key={key} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-md font-medium text-gray-800 capitalize">{key.replace(/_/g, ' ')}</h4>
                      <p className="text-sm text-gray-500">
                        {key === 'orderConfirmation' && 'Sent when an order is placed'}
                        {key === 'shippingConfirmation' && 'Sent when an order is shipped'}
                        {key === 'orderCancellation' && 'Sent when an order is cancelled'}
                        {key === 'accountCreation' && 'Sent when a new account is created'}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="relative inline-block w-12 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id={`template_${key}_enabled`}
                          checked={template.enabled}
                          onChange={(e) => onEmailTemplatesChange({ 
                            [key]: { 
                              ...template, 
                              enabled: e.target.checked 
                            } 
                          })}
                          disabled={loading}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`template_${key}_enabled`}
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                            template.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span
                            className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                              template.enabled ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          ></span>
                        </label>
                      </div>
                      <button
                        type="button"
                        disabled={loading}
                        className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Email Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sender Name</label>
                <input
                  type="text"
                  value="10X Drinks"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Your Store Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sender Email</label>
                <input
                  type="email"
                  value="noreply@10xdrinks.com"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="noreply@yourstore.com"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Rules */}
      {activeSection === 'notifications' && (
        <div className="space-y-6">
          {/* Admin Notifications */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Admin Notifications</h3>
              <p className="text-sm text-gray-500">Configure when and how you receive notifications</p>
            </div>
            <div className="p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Push
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SMS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(settings.notificationRules).map(([key, rule]) => (
                    <tr key={key}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {key.replace(/_/g, ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                          type="checkbox"
                          checked={rule.email}
                          onChange={(e) => onNotificationRulesChange({ 
                            [key]: { 
                              ...rule, 
                              email: e.target.checked 
                            } 
                          })}
                          disabled={loading}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                          type="checkbox"
                          checked={rule.push}
                          onChange={(e) => onNotificationRulesChange({ 
                            [key]: { 
                              ...rule, 
                              push: e.target.checked 
                            } 
                          })}
                          disabled={loading}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                          type="checkbox"
                          checked={rule.sms}
                          onChange={(e) => onNotificationRulesChange({ 
                            [key]: { 
                              ...rule, 
                              sms: e.target.checked 
                            } 
                          })}
                          disabled={loading}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Notification Preferences */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Notification Preferences</h3>
            <p className="text-sm text-gray-500 mb-4">
              Allow customers to choose which notifications they want to receive
            </p>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="customer_preferences"
                checked={true}
                disabled={loading}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="customer_preferences" className="ml-2 block text-sm text-gray-700">
                Enable customer notification preferences
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Automated Emails */}
      {activeSection === 'automated' && (
        <div className="space-y-6">
          {/* Abandoned Cart Reminder */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Abandoned Cart Reminder</h3>
                <p className="text-sm text-gray-500">Send reminders to customers who abandon their carts</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="abandoned_cart_enabled"
                  checked={settings.automatedEmails.abandonedCart.enabled}
                  onChange={(e) => onAutomatedEmailsChange({ 
                    abandonedCart: { 
                      ...settings.automatedEmails.abandonedCart, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="abandoned_cart_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.automatedEmails.abandonedCart.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.automatedEmails.abandonedCart.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.automatedEmails.abandonedCart.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delay (hours)</label>
                    <input
                      type="number"
                      min="1"
                      max="72"
                      value={settings.automatedEmails.abandonedCart.delay}
                      onChange={(e) => onAutomatedEmailsChange({ 
                        abandonedCart: { 
                          ...settings.automatedEmails.abandonedCart, 
                          delay: parseInt(e.target.value) || 24 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      How long to wait after cart abandonment before sending the email.
                    </p>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Edit Template
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Review Request */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Review Request</h3>
                <p className="text-sm text-gray-500">Ask customers to review their purchases</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="review_request_enabled"
                  checked={settings.automatedEmails.reviewRequest.enabled}
                  onChange={(e) => onAutomatedEmailsChange({ 
                    reviewRequest: { 
                      ...settings.automatedEmails.reviewRequest, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="review_request_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.automatedEmails.reviewRequest.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.automatedEmails.reviewRequest.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.automatedEmails.reviewRequest.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delay (hours)</label>
                    <input
                      type="number"
                      min="1"
                      max="240"
                      value={settings.automatedEmails.reviewRequest.delay}
                      onChange={(e) => onAutomatedEmailsChange({ 
                        reviewRequest: { 
                          ...settings.automatedEmails.reviewRequest, 
                          delay: parseInt(e.target.value) || 72 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      How long to wait after delivery before asking for a review.
                    </p>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Edit Template
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Add New Automated Email */}
          <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Add new automated email</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create a custom automated email for specific events or triggers
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailSettings;
