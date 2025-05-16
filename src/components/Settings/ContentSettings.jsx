// src/components/Settings/ContentSettings.jsx
import React, { useState } from 'react';

const ContentSettings = ({ 
  settings = {}, 
  onSeoSettingsChange, 
  onMediaSettingsChange, 
  loading 
}) => {
  // Ensure settings objects exist to prevent errors
  const seoSettings = settings.seoSettings || {};
  const mediaSettings = settings.mediaSettings || {};
  
  // Ensure nested objects exist
  seoSettings.sitemapGeneration = seoSettings.sitemapGeneration || {};
  mediaSettings.imageOptimization = mediaSettings.imageOptimization || {};
  mediaSettings.watermark = mediaSettings.watermark || {};
  const [activeSection, setActiveSection] = useState('seo');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Content Management Settings</h2>
        <p className="text-gray-600">Configure SEO and media settings for your store.</p>
      </div>

      {/* Sub-navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveSection('seo')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'seo'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          SEO Settings
        </button>
        <button
          onClick={() => setActiveSection('media')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'media'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Media Settings
        </button>
      </div>

      {/* SEO Settings */}
      {activeSection === 'seo' && (
        <div className="space-y-6">
          {/* Default Meta Tags */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Default Meta Tags</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Title</label>
                <input
                  type="text"
                  value={seoSettings.defaultTitle || ''}
                  onChange={(e) => onSeoSettingsChange({ defaultTitle: e.target.value })}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="10X Drinks - Premium Energy Drinks"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Used when no specific title is provided for a page.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Description</label>
                <textarea
                  value={seoSettings.defaultDescription || ''}
                  onChange={(e) => onSeoSettingsChange({ defaultDescription: e.target.value })}
                  disabled={loading}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="10X Drinks offers premium energy drinks with natural ingredients to boost your performance and focus."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Used when no specific description is provided for a page.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Keywords</label>
                <input
                  type="text"
                  value={seoSettings.defaultKeywords || ''}
                  onChange={(e) => onSeoSettingsChange({ defaultKeywords: e.target.value })}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="energy drinks, natural energy, focus drinks, premium beverages"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Comma-separated keywords used when no specific keywords are provided.
                </p>
              </div>
            </div>
          </div>

          {/* Robots.txt */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Robots.txt</h3>
            <div>
              <textarea
                value={seoSettings.robotsTxt || ''}
                onChange={(e) => onSeoSettingsChange({ robotsTxt: e.target.value })}
                disabled={loading}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="User-agent: *
Allow: /
Disallow: /admin/
Disallow: /checkout/
Sitemap: https://yourdomain.com/sitemap.xml"
              />
              <p className="mt-1 text-sm text-gray-500">
                Configure which pages search engines are allowed to crawl.
              </p>
            </div>
          </div>

          {/* Sitemap Generation */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Sitemap Generation</h3>
                <p className="text-sm text-gray-500">Automatically generate a sitemap for search engines</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="sitemap_enabled"
                  checked={seoSettings.sitemapGeneration.enabled || false}
                  onChange={(e) => onSeoSettingsChange({ 
                    sitemapGeneration: { 
                      ...seoSettings.sitemapGeneration, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="sitemap_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.seoSettings.sitemapGeneration.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.seoSettings.sitemapGeneration.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.seoSettings.sitemapGeneration.enabled && (
              <div className="p-4 bg-gray-50">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Frequency</label>
                  <select
                    value={seoSettings.sitemapGeneration.frequency || 'weekly'}
                    onChange={(e) => onSeoSettingsChange({ 
                      sitemapGeneration: { 
                        ...seoSettings.sitemapGeneration, 
                        frequency: e.target.value 
                      } 
                    })}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    How often to regenerate the sitemap.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Media Settings */}
      {activeSection === 'media' && (
        <div className="space-y-6">
          {/* Image Optimization */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Image Optimization</h3>
                <p className="text-sm text-gray-500">Automatically optimize uploaded images</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="image_optimization_enabled"
                  checked={mediaSettings.imageOptimization.enabled || false}
                  onChange={(e) => onMediaSettingsChange({ 
                    imageOptimization: { 
                      ...mediaSettings.imageOptimization, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="image_optimization_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.mediaSettings.imageOptimization.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.mediaSettings.imageOptimization.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.mediaSettings.imageOptimization.enabled && (
              <div className="p-4 bg-gray-50">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quality (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={mediaSettings.imageOptimization.quality || 80}
                    onChange={(e) => onMediaSettingsChange({ 
                      imageOptimization: { 
                        ...mediaSettings.imageOptimization, 
                        quality: parseInt(e.target.value) || 80 
                      } 
                    })}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Higher values mean better quality but larger file sizes.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Upload Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Upload Size (MB)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={mediaSettings.maxUploadSize || 5}
                  onChange={(e) => onMediaSettingsChange({ maxUploadSize: parseInt(e.target.value) || 5 })}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allowed File Types</label>
                <select
                  multiple
                  value={mediaSettings.allowedFileTypes || ['jpg', 'jpeg', 'png', 'gif', 'webp']}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    onMediaSettingsChange({ allowedFileTypes: selectedOptions });
                  }}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  size={5}
                >
                  <option value="jpg">JPG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="gif">GIF</option>
                  <option value="webp">WEBP</option>
                  <option value="svg">SVG</option>
                  <option value="pdf">PDF</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Hold Ctrl/Cmd to select multiple file types.
                </p>
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Watermark</h3>
                <p className="text-sm text-gray-500">Add a watermark to uploaded images</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="watermark_enabled"
                  checked={mediaSettings.watermark.enabled || false}
                  onChange={(e) => onMediaSettingsChange({ 
                    watermark: { 
                      ...mediaSettings.watermark, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="watermark_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.mediaSettings.watermark.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.mediaSettings.watermark.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.mediaSettings.watermark.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Watermark Image</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={mediaSettings.watermark.image || ''}
                        onChange={(e) => onMediaSettingsChange({ 
                          watermark: { 
                            ...mediaSettings.watermark, 
                            image: e.target.value 
                          } 
                        })}
                        disabled={loading}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="https://example.com/watermark.png"
                      />
                      <button
                        type="button"
                        disabled={loading}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Browse
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <select
                      value={mediaSettings.watermark.position || 'center'}
                      onChange={(e) => onMediaSettingsChange({ 
                        watermark: { 
                          ...mediaSettings.watermark, 
                          position: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="center">Center</option>
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </div>
                </div>
                {mediaSettings.watermark.image && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                    <div className="relative w-full h-40 bg-gray-200 rounded-md overflow-hidden">
                      <img 
                        src={mediaSettings.watermark.image} 
                        alt="Watermark Preview" 
                        className={`absolute ${
                          mediaSettings.watermark.position === 'center' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' :
                          mediaSettings.watermark.position === 'top-left' ? 'top-2 left-2' :
                          mediaSettings.watermark.position === 'top-right' ? 'top-2 right-2' :
                          mediaSettings.watermark.position === 'bottom-left' ? 'bottom-2 left-2' :
                          'bottom-2 right-2'
                        } h-16 object-contain opacity-50`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150x50?text=Invalid+Watermark+URL';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentSettings;
