/**
 * Currency utility functions
 */

// Conversion rate from USD to INR (1 USD = ~83 INR as of current rate)
export const USD_TO_INR_RATE = 83;

/**
 * Converts a price from USD to INR
 * @param {number} usdPrice - Price in USD
 * @returns {number} - Price converted to INR
 */
export const convertUsdToInr = (usdPrice) => {
  if (typeof usdPrice !== 'number' || isNaN(usdPrice) || usdPrice === null || usdPrice === undefined) {
    return 0;
  }
  return usdPrice * USD_TO_INR_RATE;
};

/**
 * Formats a price in INR with the ₹ symbol and 2 decimal places
 * @param {number} price - Price to format
 * @returns {string} - Formatted price with ₹ symbol
 */
export const formatPriceINR = (price) => {
  if (typeof price !== 'number' || isNaN(price) || price === null || price === undefined) {
    return '₹0.00';
  }
  return `₹${price.toFixed(2)}`;
};

/**
 * Formats a price in INR with the ₹ symbol and no decimal places, with thousands separator
 * @param {number} price - Price to format
 * @returns {string} - Formatted price with ₹ symbol and thousands separator
 */
export const formatPriceINRDisplay = (price) => {
  if (typeof price !== 'number' || isNaN(price) || price === null || price === undefined) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(price));
};

/**
 * Converts a USD price to INR and formats it
 * @param {number} usdPrice - Price in USD
 * @returns {string} - Formatted price in INR with ₹ symbol
 */
export const convertAndFormatPrice = (usdPrice) => {
  if (typeof usdPrice !== 'number' || isNaN(usdPrice) || usdPrice === null || usdPrice === undefined) {
    return '₹0.00';
  }
  // Check if the price is already in INR range (typically >1000)
  // If so, don't convert, just format
  if (usdPrice >= 1000) {
    return formatPriceINR(usdPrice);
  }
  const inrPrice = convertUsdToInr(usdPrice);
  return formatPriceINR(inrPrice);
};

/**
 * Converts a USD price to INR and formats it for display with no decimals and thousands separator
 * @param {number} usdPrice - Price in USD
 * @returns {string} - Formatted price in INR with ₹ symbol
 */
export const convertAndFormatPriceDisplay = (usdPrice) => {
  if (typeof usdPrice !== 'number' || isNaN(usdPrice) || usdPrice === null || usdPrice === undefined) {
    return '₹0';
  }
  // Check if the price is already in INR range (typically >1000)
  // If so, don't convert, just format
  if (usdPrice >= 1000) {
    return formatPriceINRDisplay(usdPrice);
  }
  const inrPrice = convertUsdToInr(usdPrice);
  return formatPriceINRDisplay(inrPrice);
}; 