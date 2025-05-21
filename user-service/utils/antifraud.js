// utils/antifraud.js
const redis = require('../config/redis'); // Adjust the path as necessary

const MAX_ATTEMPTS = 50; // Maximum login attempts allowed
const LOCKOUT_TIME = 10 * 60; // 10 minutes lockout time

const bruteForceProtection = async (req, res, next) => {
  const ip = req.ip;
  const key = `login_attempts:${ip}`;
  const attempts = await redis.get(key) || 0;

  if (attempts >= MAX_ATTEMPTS) {
    return res.status(429).json({ success: false, message: 'Too many login attempts. Please try again later.' });
  }

  await redis.incr(key);
  await redis.expire(key, LOCKOUT_TIME);
  next();
};

module.exports = bruteForceProtection;
