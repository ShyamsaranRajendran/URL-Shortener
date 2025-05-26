// CacheService.js (redis wrapper)
const redis = require('../config/redis');

class CacheService {
  static async get(key) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async set(key, value, ttl = 3600) {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
    return value;
  }

  static async incr(key) {
    await redis.incr(key);
  }

  static async remove() {
    await redis.flushAll();
  }

  static async getRaw(key) {
    return await redis.get(key);
  }

  static async del(key) {
    return await redis.del(key);
  }

  static async keys(pattern) {
    return await redis.keys(pattern);
  }
}

module.exports = CacheService;
