// src/pages/EnhancedSettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from '../components/Common/Tabs';
import GeneralSettings from '../components/Settings/GeneralSettings';
import EcommerceSettings from '../components/Settings/EcommerceSettings';
import PaymentSettings from '../components/Settings/PaymentSettings';
import ShippingSettings from '../components/Settings/ShippingSettings';
import EmailSettings from '../components/Settings/EmailSettings';
import UserSecuritySettings from '../components/Settings/UserSecuritySettings';
import AnalyticsSettings from '../components/Settings/AnalyticsSettings';
import ContentSettings from '../components/Settings/ContentSettings';
import BackupSettings from '../components/Settings/BackupSettings';
import AdvancedSettings from '../components/Settings/AdvancedSettings';
import { toast } from 'react-hot-toast';
import settingsService from '../api/settingsService';

const EnhancedSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    // General Settings
    companyInfo: {
      name: '',
      logo: '',
      favicon: '',
      email: '',
      phone: '',
      address: '',
      businessHours: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      }
    },
    regional: {
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      language: 'en',
      timezone: 'Asia/Kolkata'
    },
    ui: {
      theme: 'light',
      colorScheme: 'default',
      dashboardLayout: 'default',
      customCSS: ''
    },
    
    // Ecommerce Settings
    inventory: {
      lowStockThreshold: 10,
      outOfStockBehavior: 'hide',
      stockDisplayFormat: 'exact'
    },
    productDisplay: {
      defaultSorting: 'newest',
      productsPerPage: 12,
      featuredProducts: [],
      relatedProductsAlgorithm: 'category'
    },
    pricing: {
      taxCalculation: 'inclusive',
      currencyDisplay: '₹ {price}',
      discountRules: 'percentage',
      priceRounding: 'nearest'
    },
    checkout: {
      guestCheckout: true,
      requiredFields: ['name', 'email', 'phone', 'address'],
      orderNotes: true,
      termsAndConditions: ''
    },
    
    // Payment Settings
    paymentMethods: {
      cod: { enabled: true, fee: 0 },
      razorpay: { enabled: false, keyId: '', keySecret: '', testMode: true },
      paytm: { enabled: false, merchantId: '', merchantKey: '', testMode: true },
      upi: { enabled: false, upiId: '' }
    },
    transactionSettings: {
      minOrderAmount: 0,
      maxOrderAmount: 0,
      processingFeeDisplay: true,
      currencyConversion: {}
    },
    
    // Shipping Settings
    shippingMethods: {
      standard: { enabled: true, cost: 50, freeAbove: 499 },
      express: { enabled: false, cost: 100, freeAbove: 999 },
      sameDay: { enabled: false, cost: 200, freeAbove: 1499 }
    },
    deliveryOptions: {
      estimatedDeliveryTime: true,
      deliverySlots: false,
      expressDelivery: false,
      localPickup: false,
      localPickupLocations: []
    },
    
    // Email & Notification Settings
    emailTemplates: {
      orderConfirmation: { subject: '', body: '', enabled: true },
      shippingConfirmation: { subject: '', body: '', enabled: true },
      orderCancellation: { subject: '', body: '', enabled: true },
      accountCreation: { subject: '', body: '', enabled: true }
    },
    notificationRules: {
      newOrder: { email: true, push: false, sms: false },
      lowStock: { email: true, push: false, sms: false },
      orderStatus: { email: true, push: false, sms: false },
      customerReviews: { email: true, push: false, sms: false }
    },
    automatedEmails: {
      abandonedCart: { enabled: false, delay: 24, template: '' },
      reviewRequest: { enabled: false, delay: 72, template: '' }
    },
    
    // Analytics & Integration Settings
    analytics: {
      googleAnalytics: {
        enabled: false,
        trackingId: ''
      },
      facebookPixel: {
        enabled: false,
        pixelId: ''
      },
      customTracking: {
        enabled: false,
        script: ''
      }
    },
    integrations: {
      socialMedia: {
        facebook: {
          enabled: false,
          appId: '',
          appSecret: ''
        },
        instagram: {
          enabled: false,
          appId: '',
          appSecret: ''
        }
      },
      marketing: {
        mailchimp: {
          enabled: false,
          apiKey: '',
          listId: ''
        },
        klaviyo: {
          enabled: false,
          apiKey: '',
          listId: ''
        }
      }
    },
    
    // Content Management Settings
    seoSettings: {
      defaultTitle: '',
      defaultDescription: '',
      defaultKeywords: '',
      robotsTxt: '',
      sitemapGeneration: {
        enabled: false,
        frequency: 'weekly'
      }
    },
    mediaSettings: {
      imageOptimization: {
        enabled: true,
        quality: 80
      },
      maxUploadSize: 5,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      watermark: {
        enabled: false,
        image: '',
        position: 'bottom-right'
      }
    },
    
    // Backup & Maintenance Settings
    backupSettings: {
      automatedBackups: {
        enabled: false,
        frequency: 'daily',
        time: '02:00',
        retentionDays: 30
      },
      storageLocation: {
        type: 'local',
        localPath: '',
        s3Bucket: '',
        s3AccessKey: '',
        s3SecretKey: ''
      }
    },
    maintenanceSettings: {
      enabled: false,
      message: 'We\'re currently performing maintenance. Please check back soon.',
      expectedCompletion: '',
      allowAdminAccess: true,
      scheduledMaintenance: {
        enabled: false,
        startTime: '',
        endTime: ''
      }
    },
    
    // Advanced Settings
    developerSettings: {
      api: {
        enabled: false,
        rateLimit: 60,
        requireAuthentication: true
      },
      webhooks: {
        enabled: false,
        orderCreatedUrl: '',
        orderUpdatedUrl: '',
        userRegisteredUrl: ''
      },
      debugMode: {
        enabled: false,
        logLevel: 'error',
        displayErrors: false
      }
    },
    performanceSettings: {
      caching: {
        enabled: false,
        duration: 60,
        cacheProducts: true,
        cacheCategories: true,
        cacheHome: true
      },
      lazyLoading: true,
      minification: {
        enabled: false,
        html: true,
        css: true,
        js: true
      }
    },
    
    // User & Security Settings
    userManagement: {
      roles: {
        admin: { permissions: ['all'] },
        manager: { permissions: ['read', 'write', 'update'] },
        editor: { permissions: ['read', 'write'] },
        viewer: { permissions: ['read'] }
      },
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false
      },
      twoFactorAuth: {
        enabled: false,
        method: 'email'
      },
      sessionTimeout: 60 // minutes
    },
    securitySettings: {
      captcha: { enabled: false, siteKey: '', secretKey: '' },
      loginAttempts: { max: 5, lockoutTime: 30 },
      ipBlocking: { enabled: false, blockedIPs: [] }
    },
    
    // Analytics & Integration Settings
    analytics: {
      googleAnalytics: { enabled: false, trackingId: '' },
      facebookPixel: { enabled: false, pixelId: '' },
      customTracking: { enabled: false, script: '' }
    },
    integrations: {
      socialMedia: {
        facebook: { enabled: false, appId: '', appSecret: '' },
        instagram: { enabled: false, appId: '', appSecret: '' }
      },
      marketing: {
        mailchimp: { enabled: false, apiKey: '', listId: '' },
        klaviyo: { enabled: false, apiKey: '', listId: '' }
      },
      crm: {
        zoho: { enabled: false, apiKey: '' },
        hubspot: { enabled: false, apiKey: '' }
      }
    },
    
    // Content Management Settings
    seoSettings: {
      defaultTitle: '',
      defaultDescription: '',
      defaultKeywords: '',
      robotsTxt: '',
      sitemapGeneration: { enabled: true, frequency: 'weekly' }
    },
    mediaSettings: {
      imageOptimization: { enabled: true, quality: 80 },
      maxUploadSize: 5, // MB
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      watermark: { enabled: false, image: '', position: 'center' }
    },
    
    // Backup & Maintenance Settings
    backupConfig: {
      automated: { enabled: false, frequency: 'daily', time: '00:00' },
      storage: { local: true, cloud: false, cloudProvider: '' },
      retention: { period: 30, maxBackups: 10 }
    },
    maintenanceMode: {
      enabled: false,
      message: 'We are currently performing maintenance. Please check back soon.',
      whitelistedIPs: [],
      scheduled: { enabled: false, start: '', end: '' }
    },
    
    // Advanced Settings
    developerOptions: {
      apiAccess: { enabled: false, tokens: [] },
      webhooks: { enabled: false, endpoints: [] },
      debugMode: false,
      customCode: { header: '', footer: '', css: '' }
    },
    performanceOptimization: {
      caching: { enabled: true, duration: 3600 },
      lazyLoading: { enabled: true, threshold: '200px' },
      databaseOptimization: { autoCleanup: true, frequency: 'weekly' },
      cdn: { enabled: false, provider: '', url: '' }
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const currentSettings = await settingsService.getSettings();
        setSettings(prev => ({
          ...prev,
          ...currentSettings
        }));
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError(err.message || 'Failed to fetch settings');
        toast.error(`Error loading settings: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingsChange = (section, data) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data
      }
    }));
  };

  const handleNestedSettingsChange = (section, subsection, data) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section]?.[subsection],
          ...data
        }
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await settingsService.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(err.message || 'Failed to save settings');
      toast.error(`Error saving settings: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && Object.keys(settings).length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-3 text-lg font-medium">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Settings</h1>
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save All Settings'
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'general'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General Settings
            </button>
            <button
              onClick={() => setActiveTab('ecommerce')}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'ecommerce'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              E-commerce
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'payment'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Payment
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'shipping'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Shipping
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'email'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Email & Notifications
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users & Security
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'content'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'backup'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Backup
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'advanced'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Advanced
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <GeneralSettings 
              settings={{
                companyInfo: settings.companyInfo,
                regional: settings.regional,
                ui: settings.ui
              }}
              onCompanyInfoChange={(data) => handleNestedSettingsChange('companyInfo', '', data)}
              onRegionalChange={(data) => handleNestedSettingsChange('regional', '', data)}
              onUiChange={(data) => handleNestedSettingsChange('ui', '', data)}
              loading={loading}
            />
          )}

          {activeTab === 'ecommerce' && (
            <EcommerceSettings 
              settings={{
                inventory: settings.inventory,
                productDisplay: settings.productDisplay,
                pricing: settings.pricing,
                checkout: settings.checkout
              }}
              onInventoryChange={(data) => handleNestedSettingsChange('inventory', '', data)}
              onProductDisplayChange={(data) => handleNestedSettingsChange('productDisplay', '', data)}
              onPricingChange={(data) => handleNestedSettingsChange('pricing', '', data)}
              onCheckoutChange={(data) => handleNestedSettingsChange('checkout', '', data)}
              loading={loading}
            />
          )}

          {activeTab === 'payment' && (
            <PaymentSettings 
              settings={{
                paymentMethods: settings.paymentMethods,
                transactionSettings: settings.transactionSettings
              }}
              onPaymentMethodsChange={(data) => handleNestedSettingsChange('paymentMethods', '', data)}
              onTransactionSettingsChange={(data) => handleNestedSettingsChange('transactionSettings', '', data)}
              loading={loading}
            />
          )}

          {activeTab === 'shipping' && (
            <ShippingSettings 
              settings={{
                shippingMethods: settings.shippingMethods,
                deliveryOptions: settings.deliveryOptions
              }}
              onShippingMethodsChange={(data) => handleNestedSettingsChange('shippingMethods', '', data)}
              onDeliveryOptionsChange={(data) => handleNestedSettingsChange('deliveryOptions', '', data)}
              loading={loading}
            />
          )}

          {activeTab === 'email' && (
            <EmailSettings 
              settings={{
                emailTemplates: settings.emailTemplates,
                notificationRules: settings.notificationRules,
                automatedEmails: settings.automatedEmails
              }}
              onEmailTemplatesChange={(data) => handleNestedSettingsChange('emailTemplates', '', data)}
              onNotificationRulesChange={(data) => handleNestedSettingsChange('notificationRules', '', data)}
              onAutomatedEmailsChange={(data) => handleNestedSettingsChange('automatedEmails', '', data)}
              loading={loading}
            />
          )}

          {activeTab === 'users' && (
            <UserSecuritySettings 
              settings={{
                userManagement: settings.userManagement,
                securitySettings: settings.securitySettings
              }}
              onUserManagementChange={(data) => handleNestedSettingsChange('userManagement', '', data)}
              onSecuritySettingsChange={(data) => handleNestedSettingsChange('securitySettings', '', data)}
              loading={loading}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsSettings 
              settings={{
                analytics: settings.analytics,
                integrations: settings.integrations
              }}
              onAnalyticsChange={(data) => handleNestedSettingsChange('analytics', '', data)}
              onIntegrationsChange={(data) => handleNestedSettingsChange('integrations', '', data)}
              loading={loading}
            />
          )}

          {activeTab === 'content' && (
            <ContentSettings 
              settings={{
                seoSettings: settings.seoSettings,
                mediaSettings: settings.mediaSettings
              }}
              onSeoSettingsChange={(data) => handleNestedSettingsChange('seoSettings', '', data)}
              onMediaSettingsChange={(data) => handleNestedSettingsChange('mediaSettings', '', data)}
              loading={loading}
            />
          )}

          {activeTab === 'backup' && (
            <BackupSettings 
              settings={{
                backupSettings: settings.backupSettings,
                maintenanceSettings: settings.maintenanceSettings
              }}
              onBackupSettingsChange={(data) => handleNestedSettingsChange('backupSettings', '', data)}
              onMaintenanceSettingsChange={(data) => handleNestedSettingsChange('maintenanceSettings', '', data)}
              loading={loading}
            />
          )}

          {activeTab === 'advanced' && (
            <AdvancedSettings 
              settings={{
                developerSettings: settings.developerSettings,
                performanceSettings: settings.performanceSettings
              }}
              onDeveloperSettingsChange={(data) => handleNestedSettingsChange('developerSettings', '', data)}
              onPerformanceSettingsChange={(data) => handleNestedSettingsChange('performanceSettings', '', data)}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSettingsPage;
