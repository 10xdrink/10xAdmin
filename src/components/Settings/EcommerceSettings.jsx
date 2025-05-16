// src/components/Settings/EcommerceSettings.jsx
import React, { useState } from 'react';

const EcommerceSettings = ({ 
  settings, 
  onInventoryChange, 
  onProductDisplayChange, 
  onPricingChange, 
  onCheckoutChange, 
  loading 
}) => {
  const [activeSection, setActiveSection] = useState('inventory');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">E-commerce Settings</h2>
        <p className="text-gray-600">Configure how your products are displayed, managed, and sold on your store.</p>
      </div>

      {/* Sub-navigation */}
      <div className="flex mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveSection('inventory')}
          className={`mr-4 pb-2 text-sm font-medium whitespace-nowrap ${
            activeSection === 'inventory'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Inventory Management
        </button>
        <button
          onClick={() => setActiveSection('product')}
          className={`mr-4 pb-2 text-sm font-medium whitespace-nowrap ${
            activeSection === 'product'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Product Display
        </button>
        <button
          onClick={() => setActiveSection('pricing')}
          className={`mr-4 pb-2 text-sm font-medium whitespace-nowrap ${
            activeSection === 'pricing'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pricing Settings
        </button>
        <button
          onClick={() => setActiveSection('checkout')}
          className={`mr-4 pb-2 text-sm font-medium whitespace-nowrap ${
            activeSection === 'checkout'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Checkout Settings
        </button>
      </div>

      {/* Inventory Management */}
      {activeSection === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
              <div className="flex">
                <input
                  type="number"
                  min="0"
                  value={settings.inventory.lowStockThreshold}
                  onChange={(e) => onInventoryChange({ lowStockThreshold: parseInt(e.target.value) || 0 })}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                  units
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                You'll receive notifications when stock falls below this number.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Out of Stock Behavior</label>
              <select
                value={settings.inventory.outOfStockBehavior}
                onChange={(e) => onInventoryChange({ outOfStockBehavior: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="hide">Hide product</option>
                <option value="show_unavailable">Show as unavailable</option>
                <option value="allow_backorders">Allow backorders</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                How to handle products when they're out of stock.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Display Format</label>
            <select
              value={settings.inventory.stockDisplayFormat}
              onChange={(e) => onInventoryChange({ stockDisplayFormat: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="exact">Show exact stock count</option>
              <option value="low_stock">Show "Low Stock" warning only</option>
              <option value="in_stock">Show "In Stock" or "Out of Stock" only</option>
              <option value="none">Don't show stock information</option>
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-800 mb-3">Stock Notifications</h3>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="notify_admin"
                checked={true}
                disabled={loading}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="notify_admin" className="ml-2 block text-sm text-gray-700">
                Notify administrators when stock is low
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="auto_restock"
                checked={false}
                disabled={loading}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="auto_restock" className="ml-2 block text-sm text-gray-700">
                Enable automatic restock notifications to suppliers
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Product Display Settings */}
      {activeSection === 'product' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Sorting</label>
              <select
                value={settings.productDisplay.defaultSorting}
                onChange={(e) => onProductDisplayChange({ defaultSorting: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="newest">Newest first</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Products Per Page</label>
              <select
                value={settings.productDisplay.productsPerPage}
                onChange={(e) => onProductDisplayChange({ productsPerPage: parseInt(e.target.value) })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="8">8 products</option>
                <option value="12">12 products</option>
                <option value="16">16 products</option>
                <option value="24">24 products</option>
                <option value="36">36 products</option>
                <option value="48">48 products</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Related Products Algorithm</label>
            <select
              value={settings.productDisplay.relatedProductsAlgorithm}
              onChange={(e) => onProductDisplayChange({ relatedProductsAlgorithm: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="category">Same category</option>
              <option value="tags">Shared tags</option>
              <option value="purchased_together">Frequently purchased together</option>
              <option value="viewed_together">Frequently viewed together</option>
              <option value="manual">Manual selection only</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              How to determine which products to show as related items.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-800 mb-3">Featured Products</h3>
            <p className="text-sm text-gray-600 mb-3">
              Select products to feature prominently on your homepage and category pages.
            </p>
            <button
              type="button"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Manage Featured Products
            </button>
          </div>
        </div>
      )}

      {/* Pricing Settings */}
      {activeSection === 'pricing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Calculation</label>
              <select
                value={settings.pricing.taxCalculation}
                onChange={(e) => onPricingChange({ taxCalculation: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="inclusive">Tax inclusive (prices include tax)</option>
                <option value="exclusive">Tax exclusive (tax added at checkout)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency Display Format</label>
              <input
                type="text"
                value={settings.pricing.currencyDisplay}
                onChange={(e) => onPricingChange({ currencyDisplay: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="₹ {price}"
              />
              <p className="mt-1 text-sm text-gray-500">
                Use {price} as a placeholder for the actual price value.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Rules</label>
              <select
                value={settings.pricing.discountRules}
                onChange={(e) => onPricingChange({ discountRules: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="percentage">Percentage based</option>
                <option value="fixed">Fixed amount</option>
                <option value="both">Allow both types</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Rounding</label>
              <select
                value={settings.pricing.priceRounding}
                onChange={(e) => onPricingChange({ priceRounding: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="none">No rounding</option>
                <option value="nearest">Round to nearest whole number</option>
                <option value="down">Round down</option>
                <option value="up">Round up</option>
                <option value="nearest_99">Round to nearest .99</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-800 mb-3">Price Display Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Regular Price</p>
                <p className="text-lg font-medium">₹ 1,299.00</p>
              </div>
              <div className="p-3 bg-white rounded border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Sale Price</p>
                <div>
                  <span className="text-lg font-medium text-red-600">₹ 999.00</span>
                  <span className="text-sm text-gray-400 line-through ml-2">₹ 1,299.00</span>
                </div>
              </div>
              <div className="p-3 bg-white rounded border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">With Tax</p>
                <p className="text-lg font-medium">₹ 1,178.82</p>
                <p className="text-xs text-gray-400">Incl. 18% GST</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Settings */}
      {activeSection === 'checkout' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-6">
            <div>
              <h3 className="text-md font-medium text-gray-800">Guest Checkout</h3>
              <p className="text-sm text-gray-500">Allow customers to check out without creating an account</p>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="guest_checkout"
                checked={settings.checkout.guestCheckout}
                onChange={(e) => onCheckoutChange({ guestCheckout: e.target.checked })}
                disabled={loading}
                className="sr-only"
              />
              <label
                htmlFor="guest_checkout"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                  settings.checkout.guestCheckout ? 'bg-indigo-600' : 'bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                    settings.checkout.guestCheckout ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Required Fields at Checkout</label>
            <div className="space-y-3">
              {['name', 'email', 'phone', 'address', 'city', 'state', 'pincode', 'country'].map((field) => (
                <div key={field} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`field_${field}`}
                    checked={settings.checkout.requiredFields.includes(field)}
                    onChange={(e) => {
                      const updatedFields = e.target.checked
                        ? [...settings.checkout.requiredFields, field]
                        : settings.checkout.requiredFields.filter(f => f !== field);
                      onCheckoutChange({ requiredFields: updatedFields });
                    }}
                    disabled={loading || ['name', 'email'].includes(field)} // Name and email always required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`field_${field}`} className="ml-2 block text-sm text-gray-700 capitalize">
                    {field}
                    {['name', 'email'].includes(field) && <span className="text-red-500 ml-1">*</span>}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <h3 className="text-md font-medium text-gray-800">Order Notes</h3>
              <p className="text-sm text-gray-500">Allow customers to add notes to their orders</p>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="order_notes"
                checked={settings.checkout.orderNotes}
                onChange={(e) => onCheckoutChange({ orderNotes: e.target.checked })}
                disabled={loading}
                className="sr-only"
              />
              <label
                htmlFor="order_notes"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                  settings.checkout.orderNotes ? 'bg-indigo-600' : 'bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                    settings.checkout.orderNotes ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terms and Conditions</label>
            <textarea
              value={settings.checkout.termsAndConditions}
              onChange={(e) => onCheckoutChange({ termsAndConditions: e.target.value })}
              disabled={loading}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter your terms and conditions text here. Customers will need to accept these before completing their purchase."
            />
            <p className="mt-1 text-sm text-gray-500">
              This text will be displayed at checkout and customers will be required to accept it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcommerceSettings;
