// utils/anomalyDetection.js
const redis = require('../config/redis'); // Adjust the path as necessary
const User = require('../models/User'); // Adjust the path as necessary
const detectAnomalies = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findByEmail(email);
  if (!user) return next();

  const key = `user:${user.id}:last_login`;
  const lastLogin = await redis.get(key);
  const currentIp = req.ip;
  const currentDevice = req.headers['user-agent'];

  if (lastLogin && (lastLogin !== currentIp || lastLogin !== currentDevice)) {
    // Trigger alert or log anomaly
    console.warn(`Anomaly detected for user ${user.id}: login from new device/IP`);
    // Optionally: send email/alert for security
  }

  await redis.set(key, currentIp, 'EX', 24 * 60 * 60); // Store for 1 day
  next();
};

module.exports = detectAnomalies;
