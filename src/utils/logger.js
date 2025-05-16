/**
 * Simple logger utility that provides different log levels
 * and standardizes logging across the application
 */
const logger = {
  /**
   * Log error messages
   * @param {string} message - Main error message
   * @param {Error|Object} error - Error object or additional data
   */
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
  },

  /**
   * Log warning messages
   * @param {string} message - Warning message
   * @param {Object} data - Additional data (optional)
   */
  warn: (message, data) => {
    if (data) {
      console.warn(`[WARN] ${message}`, data);
    } else {
      console.warn(`[WARN] ${message}`);
    }
  },

  /**
   * Log info messages
   * @param {string} message - Info message
   * @param {Object} data - Additional data (optional)
   */
  info: (message, data) => {
    if (process.env.NODE_ENV !== 'production') {
      if (data) {
        console.info(`[INFO] ${message}`, data);
      } else {
        console.info(`[INFO] ${message}`);
      }
    }
  },

  /**
   * Log debug messages (only in development)
   * @param {string} message - Debug message
   * @param {Object} data - Additional data (optional)
   */
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      if (data) {
        console.debug(`[DEBUG] ${message}`, data);
      } else {
        console.debug(`[DEBUG] ${message}`);
      }
    }
  }
};

export default logger; 