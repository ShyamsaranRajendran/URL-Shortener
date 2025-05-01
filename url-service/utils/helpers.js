const crypto = require('crypto');

/**
 * Generate a random short code (Base62 characters)
 * @returns {string}
 */
exports.generateShortCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';
  for (let i = 0; i < 8; i++) { // 8 characters = 62^8 possibilities (~218 trillion)
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortCode += characters[randomIndex];
  }
  return shortCode;
};

/**
 * Validate if a string is a valid URL
 * @param {string} url
 * @returns {boolean}
 */
exports.validateUrl = (url) => {
  try {
    new URL(url); // Will throw if invalid
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Sleep utility (for retry strategies, optional use)
 * @param {number} ms
 * @returns {Promise<void>}
 */
exports.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Normalize URL (optional if you want consistency)
 * @param {string} url
 * @returns {string}
 */
exports.normalizeUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch (_) {
    return url;
  }
};
