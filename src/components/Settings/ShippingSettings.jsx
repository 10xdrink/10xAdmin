// src/components/Settings/ShippingSettings.jsx
import React, { useState } from 'react';

const ShippingSettings = ({ 
  settings, 
  onShippingMethodsChange, 
  onDeliveryOptionsChange, 
  loading 
}) => {
  const [activeSection, setActiveSection] = useState('methods');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping & Delivery Settings</h2>
        <p className="text-gray-600">Configure shipping methods and delivery options for your store.</p>
      </div>

      {/* Sub-navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveSection('methods')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'methods'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Shipping Methods
        </button>
        <button
          onClick={() => setActiveSection('delivery')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'delivery'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Delivery Options
        </button>
      </div>

      {/* Shipping Methods */}
      {activeSection === 'methods' && (
        <div className="space-y-6">
          {/* Standard Shipping */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Standard Shipping</h3>
                  <p className="text-sm text-gray-500">Regular delivery option (3-5 business days)</p>
                </div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="standard_enabled"
                  checked={settings.shippingMethods.standard.enabled}
                  onChange={(e) => onShippingMethodsChange({ 
                    standard: { 
                      ...settings.shippingMethods.standard, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="standard_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.shippingMethods.standard.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.shippingMethods.standard.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.shippingMethods.standard.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={settings.shippingMethods.standard.cost}
                        onChange={(e) => onShippingMethodsChange({ 
                          standard: { 
                            ...settings.shippingMethods.standard, 
                            cost: parseFloat(e.target.value) || 0 
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Above</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={settings.shippingMethods.standard.freeAbove}
                        onChange={(e) => onShippingMethodsChange({ 
                          standard: { 
                            ...settings.shippingMethods.standard, 
                            freeAbove: parseFloat(e.target.value) || 0 
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Set to 0 to disable free shipping.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Express Shipping */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Express Shipping</h3>
                  <p className="text-sm text-gray-500">Faster delivery option (1-2 business days)</p>
                </div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="express_enabled"
                  checked={settings.shippingMethods.express.enabled}
                  onChange={(e) => onShippingMethodsChange({ 
                    express: { 
                      ...settings.shippingMethods.express, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="express_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.shippingMethods.express.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.shippingMethods.express.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.shippingMethods.express.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={settings.shippingMethods.express.cost}
                        onChange={(e) => onShippingMethodsChange({ 
                          express: { 
                            ...settings.shippingMethods.express, 
                            cost: parseFloat(e.target.value) || 0 
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Above</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={settings.shippingMethods.express.freeAbove}
                        onChange={(e) => onShippingMethodsChange({ 
                          express: { 
                            ...settings.shippingMethods.express, 
                            freeAbove: parseFloat(e.target.value) || 0 
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Same Day Delivery */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Same Day Delivery</h3>
                  <p className="text-sm text-gray-500">Delivery on the same day (select areas only)</p>
                </div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="sameday_enabled"
                  checked={settings.shippingMethods.sameDay.enabled}
                  onChange={(e) => onShippingMethodsChange({ 
                    sameDay: { 
                      ...settings.shippingMethods.sameDay, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="sameday_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.shippingMethods.sameDay.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.shippingMethods.sameDay.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.shippingMethods.sameDay.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={settings.shippingMethods.sameDay.cost}
                        onChange={(e) => onShippingMethodsChange({ 
                          sameDay: { 
                            ...settings.shippingMethods.sameDay, 
                            cost: parseFloat(e.target.value) || 0 
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Above</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={settings.shippingMethods.sameDay.freeAbove}
                        onChange={(e) => onShippingMethodsChange({ 
                          sameDay: { 
                            ...settings.shippingMethods.sameDay, 
                            freeAbove: parseFloat(e.target.value) || 0 
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delivery Options */}
      {activeSection === 'delivery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <h3 className="text-md font-medium text-gray-800">Estimated Delivery Time</h3>
              <p className="text-sm text-gray-500">Show estimated delivery time on product and checkout pages</p>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="estimated_delivery_time"
                checked={settings.deliveryOptions.estimatedDeliveryTime}
                onChange={(e) => onDeliveryOptionsChange({ estimatedDeliveryTime: e.target.checked })}
                disabled={loading}
                className="sr-only"
              />
              <label
                htmlFor="estimated_delivery_time"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                  settings.deliveryOptions.estimatedDeliveryTime ? 'bg-indigo-600' : 'bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                    settings.deliveryOptions.estimatedDeliveryTime ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <h3 className="text-md font-medium text-gray-800">Delivery Slot Selection</h3>
              <p className="text-sm text-gray-500">Allow customers to choose a specific delivery time slot</p>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="delivery_slots"
                checked={settings.deliveryOptions.deliverySlots}
                onChange={(e) => onDeliveryOptionsChange({ deliverySlots: e.target.checked })}
                disabled={loading}
                className="sr-only"
              />
              <label
                htmlFor="delivery_slots"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                  settings.deliveryOptions.deliverySlots ? 'bg-indigo-600' : 'bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                    settings.deliveryOptions.deliverySlots ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <h3 className="text-md font-medium text-gray-800">Express Delivery</h3>
              <p className="text-sm text-gray-500">Offer express delivery options for urgent orders</p>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="express_delivery"
                checked={settings.deliveryOptions.expressDelivery}
                onChange={(e) => onDeliveryOptionsChange({ expressDelivery: e.target.checked })}
                disabled={loading}
                className="sr-only"
              />
              <label
                htmlFor="express_delivery"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                  settings.deliveryOptions.expressDelivery ? 'bg-indigo-600' : 'bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                    settings.deliveryOptions.expressDelivery ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <h3 className="text-md font-medium text-gray-800">Local Pickup</h3>
              <p className="text-sm text-gray-500">Allow customers to pick up orders from your location</p>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="local_pickup"
                checked={settings.deliveryOptions.localPickup}
                onChange={(e) => onDeliveryOptionsChange({ localPickup: e.target.checked })}
                disabled={loading}
                className="sr-only"
              />
              <label
                htmlFor="local_pickup"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                  settings.deliveryOptions.localPickup ? 'bg-indigo-600' : 'bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                    settings.deliveryOptions.localPickup ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>

          {settings.deliveryOptions.localPickup && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-800 mb-3">Pickup Locations</h3>
              <p className="text-sm text-gray-500 mb-3">
                Add locations where customers can pick up their orders.
              </p>
              <button
                type="button"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Manage Pickup Locations
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShippingSettings;
