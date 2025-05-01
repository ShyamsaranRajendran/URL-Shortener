const redis = require('redis');
const logger = require('../utils/logger');

let redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  const host = process.env.REDIS_HOST || 'localhost';
  const port = process.env.REDIS_PORT || '6379';
  redisUrl = `redis://${host}:${port}`;
}

const client = redis.createClient({
  url: redisUrl,
  socket: {
    tls: process.env.REDIS_TLS === 'true',
    rejectUnauthorized: process.env.REDIS_TLS === 'true' ? false : undefined,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

client.on('error', (err) => logger.error('Redis Client Error:', err));

(async () => {
  try {
    await client.connect();
    logger.info('Successfully connected to Redis at', redisUrl);
  } catch (err) {
    logger.error('Failed to connect to Redis:', err);
  }
})();

module.exports = client;
