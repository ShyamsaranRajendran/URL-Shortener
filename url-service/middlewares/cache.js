const CacheService = require('../services/cache.service');

const cacheMiddleware = (keyPrefix, ttl = 3600) => {
  return async (req, res, next) => {
    const cacheKey = `${keyPrefix}:${req.params.code || req.path}`;
    const cachedData = await CacheService.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      CacheService.set(cacheKey, body, ttl);
      res.sendResponse(body);
    };
    next();
  };
};

module.exports = cacheMiddleware;