// src/components/Settings/PaymentSettings.jsx
import React, { useState } from 'react';

const PaymentSettings = ({ 
  settings, 
  onPaymentMethodsChange, 
  onTransactionSettingsChange, 
  loading 
}) => {
  const [activeSection, setActiveSection] = useState('methods');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Gateway Settings</h2>
        <p className="text-gray-600">Configure payment methods and transaction settings for your store.</p>
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
          Payment Methods
        </button>
        <button
          onClick={() => setActiveSection('transaction')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'transaction'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Transaction Settings
        </button>
      </div>

      {/* Payment Methods */}
      {activeSection === 'methods' && (
        <div className="space-y-6">
          {/* Cash on Delivery */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Cash on Delivery</h3>
                  <p className="text-sm text-gray-500">Allow customers to pay when they receive their order</p>
                </div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="cod_enabled"
                  checked={settings.paymentMethods.cod.enabled}
                  onChange={(e) => onPaymentMethodsChange({ 
                    cod: { 
                      ...settings.paymentMethods.cod, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="cod_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.paymentMethods.cod.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.paymentMethods.cod.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.paymentMethods.cod.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">COD Fee</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={settings.paymentMethods.cod.fee}
                        onChange={(e) => onPaymentMethodsChange({ 
                          cod: { 
                            ...settings.paymentMethods.cod, 
                            fee: parseFloat(e.target.value) || 0 
                          } 
                        })}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Additional fee to charge for Cash on Delivery orders.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Razorpay */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Razorpay</h3>
                  <p className="text-sm text-gray-500">Accept credit/debit cards, UPI, wallets, and more</p>
                </div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="razorpay_enabled"
                  checked={settings.paymentMethods.razorpay.enabled}
                  onChange={(e) => onPaymentMethodsChange({ 
                    razorpay: { 
                      ...settings.paymentMethods.razorpay, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="razorpay_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.paymentMethods.razorpay.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.paymentMethods.razorpay.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.paymentMethods.razorpay.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Key ID</label>
                    <input
                      type="text"
                      value={settings.paymentMethods.razorpay.keyId}
                      onChange={(e) => onPaymentMethodsChange({ 
                        razorpay: { 
                          ...settings.paymentMethods.razorpay, 
                          keyId: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="rzp_test_XXXXXXXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Secret</label>
                    <input
                      type="password"
                      value={settings.paymentMethods.razorpay.keySecret}
                      onChange={(e) => onPaymentMethodsChange({ 
                        razorpay: { 
                          ...settings.paymentMethods.razorpay, 
                          keySecret: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="••••••••••••••••••••••••"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="razorpay_test_mode"
                      checked={settings.paymentMethods.razorpay.testMode}
                      onChange={(e) => onPaymentMethodsChange({ 
                        razorpay: { 
                          ...settings.paymentMethods.razorpay, 
                          testMode: e.target.checked 
                        } 
                      })}
                      disabled={loading}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="razorpay_test_mode" className="ml-2 block text-sm text-gray-700">
                      Enable Test Mode
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Paytm */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Paytm</h3>
                  <p className="text-sm text-gray-500">Accept payments via Paytm wallet and other methods</p>
                </div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="paytm_enabled"
                  checked={settings.paymentMethods.paytm.enabled}
                  onChange={(e) => onPaymentMethodsChange({ 
                    paytm: { 
                      ...settings.paymentMethods.paytm, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="paytm_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.paymentMethods.paytm.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.paymentMethods.paytm.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.paymentMethods.paytm.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
                    <input
                      type="text"
                      value={settings.paymentMethods.paytm.merchantId}
                      onChange={(e) => onPaymentMethodsChange({ 
                        paytm: { 
                          ...settings.paymentMethods.paytm, 
                          merchantId: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="XXXXXXXXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Merchant Key</label>
                    <input
                      type="password"
                      value={settings.paymentMethods.paytm.merchantKey}
                      onChange={(e) => onPaymentMethodsChange({ 
                        paytm: { 
                          ...settings.paymentMethods.paytm, 
                          merchantKey: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="••••••••••••••••••••••••"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="paytm_test_mode"
                      checked={settings.paymentMethods.paytm.testMode}
                      onChange={(e) => onPaymentMethodsChange({ 
                        paytm: { 
                          ...settings.paymentMethods.paytm, 
                          testMode: e.target.checked 
                        } 
                      })}
                      disabled={loading}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="paytm_test_mode" className="ml-2 block text-sm text-gray-700">
                      Enable Test Mode
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* UPI */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">UPI Direct</h3>
                  <p className="text-sm text-gray-500">Accept UPI payments directly to your UPI ID</p>
                </div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="upi_enabled"
                  checked={settings.paymentMethods.upi.enabled}
                  onChange={(e) => onPaymentMethodsChange({ 
                    upi: { 
                      ...settings.paymentMethods.upi, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="upi_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.paymentMethods.upi.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.paymentMethods.upi.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.paymentMethods.upi.enabled && (
              <div className="p-4 bg-gray-50">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input
                    type="text"
                    value={settings.paymentMethods.upi.upiId}
                    onChange={(e) => onPaymentMethodsChange({ 
                      upi: { 
                        ...settings.paymentMethods.upi, 
                        upiId: e.target.value 
                      } 
                    })}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="yourname@upi"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter your UPI ID (e.g., yourname@okicici, 9876543210@paytm)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transaction Settings */}
      {activeSection === 'transaction' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={settings.transactionSettings.minOrderAmount}
                  onChange={(e) => onTransactionSettingsChange({ minOrderAmount: parseFloat(e.target.value) || 0 })}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Set to 0 for no minimum order amount.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Order Amount</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={settings.transactionSettings.maxOrderAmount}
                  onChange={(e) => onTransactionSettingsChange({ maxOrderAmount: parseFloat(e.target.value) || 0 })}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Set to 0 for no maximum order amount.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <h3 className="text-md font-medium text-gray-800">Display Processing Fees</h3>
              <p className="text-sm text-gray-500">Show payment processing fees to customers at checkout</p>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="processing_fee_display"
                checked={settings.transactionSettings.processingFeeDisplay}
                onChange={(e) => onTransactionSettingsChange({ processingFeeDisplay: e.target.checked })}
                disabled={loading}
                className="sr-only"
              />
              <label
                htmlFor="processing_fee_display"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                  settings.transactionSettings.processingFeeDisplay ? 'bg-indigo-600' : 'bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                    settings.transactionSettings.processingFeeDisplay ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-800 mb-3">Payment Status Notifications</h3>
            <div className="space-y-3">
              {['payment_success', 'payment_failed', 'payment_pending', 'refund_initiated', 'refund_completed'].map((status) => (
                <div key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`notify_${status}`}
                    checked={true}
                    disabled={loading}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`notify_${status}`} className="ml-2 block text-sm text-gray-700 capitalize">
                    {status.replace(/_/g, ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-800 mb-3">Currency Conversion</h3>
            <p className="text-sm text-gray-600 mb-3">
              Configure currency conversion settings for international payments.
            </p>
            <button
              type="button"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Configure Currency Conversion
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSettings;
