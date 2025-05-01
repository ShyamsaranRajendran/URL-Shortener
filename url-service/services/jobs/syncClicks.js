const cron = require('node-cron');
const CacheService = require('../cache.service');
const { query } = require('../../config/db');
const Url = require('../../models/Url');
const syncClicksToDB = async () => {
  try {
    const keys = await CacheService.keys('url-info:*');
    console.log(`Found ${keys.length} keys to process`);
    for (const key of keys) {
      const shortCode = key.split(':')[1];
      const cached = await CacheService.get(key);
      const value = parseInt(cached?.clicks ?? 0, 10); 
      console.log(`Processing key: ${key}, value: ${value}`);
    
      if (!isNaN(value) && value > 0) {
        await Url.incrementClicks(value, shortCode);
        console.log(`Incremented clicks for ${shortCode} by ${value}`);
        await CacheService.del(key);
      }
    }
    
    console.log(`[CRON] Click counts synced at ${new Date().toISOString()}`);
  } catch (err) {
    console.error('[CRON ERROR] Failed syncing clicks:', err);
  }
};

cron.schedule('*/1 * * * *', syncClicksToDB);
