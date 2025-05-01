const redis = require('redis');
const logger = require('../utils/logger'); 
const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const client = redis.createClient({
  url: redisUrl,
  socket: {
    tls: process.env.REDIS_TLS === 'true', 
    rejectUnauthorized: process.env.REDIS_TLS === 'true' ? false : undefined
  }
});

client.on('error', (err) => logger.error('Redis Client Error:', err));

(async () => {
  try {
    await client.connect();
    logger.info('Successfully connected to Redis');
  } catch (err) {
    logger.error('Failed to connect to Redis:', err);
  }
})();

module.exports = client;
