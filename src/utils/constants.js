// src/utils/constants.js

export const USER_ROLES = {
  SUPER_ADMIN: 'super-admin',                         // Has full access to all resources and functionalities
  PRODUCT_MANAGER: 'product-manager',                 // Manages products, categories, inventory
  ORDER_MANAGER: 'order-manager',                     // Handles orders, refunds, and transactions
  CONTENT_MANAGER: 'content-manager',                 // Manages blog posts, FAQs, SEO content
  CUSTOMER_SUPPORT_MANAGER: 'customer-support-manager', // Handles customer inquiries and support tickets
  MARKETING_MANAGER: 'marketing-manager',             // Manages discounts, coupons, email campaigns
  ANALYTICS_VIEWER: 'analytics-viewer',               // Can view reports and analytics but cannot modify data
  ADMIN_ASSISTANT: 'admin-assistant',                 // Assist admins with limited access to certain admin features
  INVENTORY_MANAGER: 'inventory-manager',             // Manages stock levels, warehouse tracking  
  SEO_MANAGER: 'seo-manager',                         // Focuses on SEO and site optimization content
  SALES_MANAGER: 'sales-manager',                     // Oversees sales-related processes, including performance monitoring
  FINANCE_MANAGER: 'finance-manager',                 // Manages financial reports, transactions, and budgets
  USER: 'user',                                       // Regular user with basic permissions
};

// Add more constants as needed
export const ERROR_CODES = {
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  AUTHENTICATION_FAILED: 'Authentication failed. Please check your credentials.',
  // Add more error codes and messages as needed
};
