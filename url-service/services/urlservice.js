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
    // const cacheKey = `url:${shortCode}`;
    // let cachedUrl = await CacheService.get(cacheKey);

    // if (cachedUrl) {
    //   console.log(`Fetched URL from cache: ${shortCode}`);
    //   return cachedUrl;
    // }

    const url = await Url.findByShortCode(shortCode);
    console.log(`Fetched URL from DB: ${shortCode}`);
    console.log(url)
    // if (url) {
    //   await CacheService.set(cacheKey, url);
    //   console.log(`Fetched URL from DB and cached: ${shortCode}`);
    // }

    return url;
  },

  async incrementClicks(shortCode) {
    // const cacheKey = `url-info:${shortCode}`;
    // let cachedClicks = await CacheService.get(cacheKey);

    // if (cachedClicks && typeof cachedClicks.clicks !== 'undefined') {
    //   cachedClicks.clicks = parseInt(cachedClicks.clicks, 10) + 1;
    //   await CacheService.set(cacheKey, cachedClicks);
    //   console.log(`Incremented clicks in cache for ${shortCode}: ${cachedClicks.clicks}`);
    // } else {
    //   const urlFromDB = await Url.findByShortCode({ short_code: shortCode });
    //   if (!urlFromDB) {
    //     console.warn(`URL not found for code: ${shortCode}`);
    //     return;
    //   }

    //   const updatedClicks = (urlFromDB.clicks || 0) + 1;
      await Url.incrementClicks(1 ,shortCode  );

    //   await CacheService.set(cacheKey, { clicks: updatedClicks });
    //   console.log(`Clicks set from DB for ${shortCode}: ${updatedClicks}`);
    // }
  },

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
  ,
  async getAllUrls() {
    return await Url.findAll();
  }
}

module.exports = UrlService;
