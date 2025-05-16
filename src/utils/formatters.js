/**
 * Format date to a human-readable format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj)) return 'Invalid Date';
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format date and time to a human-readable format
 * @param {string|Date} date - Date to format
 * @param {string} defaultValue - Default value to return if date is falsy (default: 'N/A')
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date, defaultValue = 'N/A') => {
  if (!date) return defaultValue;
  
  const dateObj = new Date(date);
  if (isNaN(dateObj)) return 'Invalid Date';
  
  // Check if the date is within the last 24 hours
  const isToday = new Date().toDateString() === dateObj.toDateString();
  
  if (isToday) {
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    return `Today at ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format large numbers with commas (e.g., 1,000,000)
 * @param {number} number - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US').format(number);
};

/**
 * Truncate a string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {string} Truncated string
 */
export const truncateString = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  
  return `${str.substring(0, maxLength)}...`;
};

/**
 * Format percentage (e.g., 12.34%)
 * @param {number} value - Value to format (0.1234 for 12.34%)
 * @param {number} precision - Decimal precision (default: 2)
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, precision = 2) => {
  if (value === null || value === undefined) return 'N/A';
  
  return `${(value * 100).toFixed(precision)}%`;
};

/**
 * Format a file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size (e.g., 1.23 MB)
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return 'N/A';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}; 