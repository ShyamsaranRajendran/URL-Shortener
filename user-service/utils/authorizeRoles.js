const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      const userRoles = await User.getUserRoles(decoded.id);

      const hasAccess = allowedRoles.some(role => userRoles.includes(role));
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  };
};

module.exports = authorizeRoles;
