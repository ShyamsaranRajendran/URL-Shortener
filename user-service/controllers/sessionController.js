const redis = require('../config/redis'); // Assuming you have Redis client in config/redis
const AuditLog = require('../models/AuditLog'); // Import your AuditLog model

// Force Logout by Admin
exports.forceLogout = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    const keys = await redis.keys(`session:${userId}:*`);
    if (keys.length) {
      await redis.del(...keys);
    }

    // Log the force logout action
    await AuditLog.create(req.user.id, 'FORCE_LOGOUT_USER', { targetUserId: userId });

    res.json({ success: true, message: `User ${userId} sessions revoked` });
  } catch (error) {
    console.error('Error in forceLogout:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Store session metadata in Redis
exports.storeSession = async (userId, token, req) => {
  try {
    const sessionKey = `session:${userId}:${token}`;
    const metadata = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      createdAt: new Date().toISOString()
    };

    await redis.set(sessionKey, JSON.stringify(metadata), 'EX', 7 * 24 * 60 * 60); // 7 days expiration
  } catch (error) {
    console.error('Error storing session:', error);
    // No need to throw, session storage failure should not block user flow
  }
};

// List active sessions for logged-in user
exports.listSessions = async (req, res) => {
  const userId = req.user.id;

  try {
    const keys = await redis.keys(`session:${userId}:*`);
    const sessions = await Promise.all(keys.map(async key => ({
      token: key.split(':')[2],
      metadata: JSON.parse(await redis.get(key))
    })));

    res.json({ success: true, sessions });
  } catch (error) {
    console.error('Error listing sessions:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Logout from all devices
exports.logoutAllDevices = async (req, res) => {
  const userId = req.user.id;

  try {
    const keys = await redis.keys(`session:${userId}:*`);
    if (keys.length) {
      await redis.del(...keys);
    }

    res.clearCookie('refreshToken'); // Assuming you use cookie for refresh token

    // Log the event
    await AuditLog.create(userId, 'LOGOUT_ALL_DEVICES');

    res.json({ success: true, message: 'Logged out from all devices' });
  } catch (error) {
    console.error('Error logging out from all devices:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
