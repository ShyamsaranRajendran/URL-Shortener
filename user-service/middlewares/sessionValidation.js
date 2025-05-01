const redis = require('../config/redis'); // Adjust the path as necessary

const sessionValidator = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ success: false, message: 'No token provided' });

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const sessionKey = `session:${decoded.id}:${decoded.sessionId}`;
  const sessionMetadata = await redis.get(sessionKey);
  if (!sessionMetadata) return res.status(403).json({ success: false, message: 'Session expired or invalid' });

  const metadata = JSON.parse(sessionMetadata);
  if (metadata.ip !== req.ip || metadata.userAgent !== req.headers['user-agent']) {
    return res.status(403).json({ success: false, message: 'Suspicious activity detected from different device or IP' });
  }

  next();
};

module.exports = sessionValidator;
