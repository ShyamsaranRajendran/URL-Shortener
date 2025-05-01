const Url = require('../models/Url');
const CacheService = require('./cache.service.js');
const { generateShortCode } = require('../utils/helpers');

const UrlService = {
  async shortenUrl(originalUrl, customAlias = null, userId = null, expiresAt = null) {
    const shortCode = customAlias || generateShortCode();
    
    // Check if custom alias already exists
    if (customAlias) {
      const existing = await Url.findByShortCode(customAlias);
      if (existing) {
        throw new Error('Custom alias already in use');
      }
    }

    const url = await Url.create({ originalUrl, shortCode, userId, expiresAt });
    return url;
  },
  
  async getUrl(shortCode) {
    const cacheKey = `url:${shortCode}`;
    const cachedUrl = await CacheService.get(cacheKey);
    if (cachedUrl) return cachedUrl;

    const url = await Url.findByShortCode(shortCode);
    if (url) {
      await CacheService.set(cacheKey, url);
    }
    return url;
  },

  async incrementClicks(shortCode) {
    const cacheKey = `url-info:${shortCode}`;
    let cachedUrl = await CacheService.get(cacheKey);
  
    if (cachedUrl) {
      cachedUrl.clicks = parseInt(cachedUrl.clicks, 10) + 1;
      await CacheService.set(cacheKey, cachedUrl);
    }
  
    // await Url.incrementClicks(shortCode);
  }
,  

  async deleteUrl(shortCode, userId) {
    const url = await Url.findByShortCode(shortCode);

    if (!url) return null;
    if (userId && url.user_id !== userId) return null; // Ensure user owns it

    await Url.deleteByShortCode(shortCode);
    await CacheService.del(`url:${shortCode}`);
    return true;
  },

  async getUrlInfo(shortCode) {
    const cacheKey = `url-info:${shortCode}`;
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const url = await Url.findByShortCode(shortCode);
    if (url) {
      await CacheService.set(cacheKey, url);
    }
    return url;
  },

  async updateUrl(shortCode, userId, { originalUrl, expiresAt }) {
    const url = await Url.findByShortCode(shortCode);

    if (!url) return null;
    if (userId && url.user_id !== userId) return null;

    const updatedUrl = await Url.updateByShortCode(shortCode, { originalUrl, expiresAt });

    await CacheService.del(`url:${shortCode}`);
    await CacheService.del(`url-info:${shortCode}`);

    return updatedUrl;
  },

  async getUserUrls(userId) {
    return await Url.findByUserId(userId);
  }
}

module.exports = UrlService;
