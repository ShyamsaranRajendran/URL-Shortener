const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');
const jwtConfig = require('../config/jwt');
const securityConfig = require('../config/security');
const sendEmail = require('../utils/sendEmail');
const logger = require('../utils/logger');
const bruteForceProtection = require('../utils/antifraud');
const sessionValidator = require('../middlewares/sessionValidation');
const detectAnomalies = require('../middlewares/anomalyDetection');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

const validatePassword = (password) => {
  const { minLength, requireUppercase, requireNumber, requireSpecialChar } = securityConfig.passwordPolicy;
  if (password.length < minLength) return false;
  if (requireUppercase && !/[A-Z]/.test(password)) return false;
  if (requireNumber && !/[0-9]/.test(password)) return false;
  if (requireSpecialChar && !/[^A-Za-z0-9]/.test(password)) return false;
  return true;
};

// ------------------ Auth Controller ------------------

// Register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!validatePassword(password)) {
      await AuditLog.create(null, 'REGISTER_ATTEMPT', { status: 'failed', reason: 'weak_password', email });
      return res.status(400).json({ message: 'Password does not meet requirements' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      await AuditLog.create(null, 'REGISTER_ATTEMPT', { status: 'failed', reason: 'email_exists', email });
      return res.status(409).json({ message: 'Email already in use' });
    }

    const user = await User.create(name, email, password);

    const verificationToken = uuidv4();
    await redis.set(`verify:${verificationToken}`, user.id, 'EX', 60 * 60);

    const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;
    await sendEmail(
      email, 
      'Verify Your Email', 
      'Click the link to verify your email', 
      `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    );

    await AuditLog.create(user.id, 'REGISTER', { status: 'success', email });
    res.status(201).json({ message: 'Registered successfully. Please verify your email.' });
  } catch (error) {
    logger.error('Register error:', error);
    await AuditLog.create(null, 'REGISTER', { status: 'failed', error: error.message });
    res.status(500).json({ message: 'Registration failed' });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const userId = await redis.get(`verify:${token}`);
    if (!userId) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    await User.markEmailVerified(userId);
    await redis.del(`verify:${token}`);

    await AuditLog.create(userId, 'EMAIL_VERIFICATION', { status: 'success' });
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    logger.error('Email verification error:', error);
    await AuditLog.create(null, 'EMAIL_VERIFICATION', { status: 'failed', error: error.message });
    res.status(500).json({ message: 'Email verification failed' });
  }
};

// Login
exports.login = [
  bruteForceProtection,
  async (req, res) => {
    const { email, password } = req.body;
    console.log('Email:', req.body.email);
console.log('Password:', req.body.password);


    try {
      const user = await User.findByEmail(email);
      if (!user) {
        await AuditLog.create(null, 'LOGIN_ATTEMPT', { status: 'failed', reason: 'user_not_found', email });
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log('Password Match:', passwordMatch);
const hashedPassword = await bcrypt.hash( user.password, 10);  // Hash the password
console.log(hashedPassword);
      if (!passwordMatch) {
        await AuditLog.create(user.id, 'LOGIN_ATTEMPT', { status: 'failed', reason: 'invalid_password' });
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (!user.email_verified) {
        await AuditLog.create(user.id, 'LOGIN_ATTEMPT', { status: 'failed', reason: 'email_not_verified' });
        return res.status(403).json({ message: 'Email not verified' });
      }

      const payload = { id: user.id, email: user.email, roles: user.roles };

      const accessToken = jwt.sign(
        payload,
        jwtConfig.accessToken.secret,
        { expiresIn: jwtConfig.accessToken.expiresIn }
      );

      const sessionId = uuidv4();

      const refreshToken = jwt.sign(
        { ...payload, sessionId },
        jwtConfig.refreshToken.secret,
        { expiresIn: jwtConfig.refreshToken.expiresIn }
      );

      await redis.set(
        `session:${user.id}:${sessionId}`,
        JSON.stringify({
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          createdAt: new Date().toISOString()
        }),
        'EX',
        7 * 24 * 60 * 60 // 7 days
      );

      res.cookie('refreshToken', refreshToken, {
        ...securityConfig.session.cookieOptions,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });

      await AuditLog.create(user.id, 'LOGIN', {
        status: 'success',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        sessionId
      });
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      console.log('User:', user);
      console.log('login successful');
      res.status(200).json({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          roles: user.roles
        }
      });

    } catch (error) {
      logger.error('Login error:', error);
      console.log('Login error:', error);
      await AuditLog.create(null, 'LOGIN_ERROR', {
        status: 'failed',
        error: error.message,
        email
      });
      res.status(500).json({err:error, message: 'Internal server error during login' });
    }
  }
];

// Refresh Token (unchanged, as it doesn't directly interact with User model)
exports.refreshToken = [
  sessionValidator,
  // detectAnomalies,
  async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

    try {
      const decoded = jwt.verify(refreshToken, jwtConfig.refreshToken.secret);

      const sessionKey = `session:${decoded.id}:${decoded.sessionId}`;
      const sessionData = await redis.get(sessionKey);
      if (!sessionData) {
        return res.status(403).json({ message: 'Invalid session' });
      }

      const payload = { id: decoded.id, email: decoded.email, roles: decoded.roles };
      const newAccessToken = jwt.sign(payload, jwtConfig.accessToken.secret, { expiresIn: jwtConfig.accessToken.expiresIn });

      const newSessionId = uuidv4();
      const newRefreshToken = jwt.sign({ ...payload, sessionId: newSessionId }, jwtConfig.refreshToken.secret, { expiresIn: jwtConfig.refreshToken.expiresIn });

      await redis.multi()
        .del(sessionKey)
        .set(
          `session:${decoded.id}:${newSessionId}`,
          JSON.stringify({ ip: req.ip, userAgent: req.headers['user-agent'], createdAt: new Date().toISOString() }),
          'EX',
          7 * 24 * 60 * 60
        )
        .exec();

      res.cookie('refreshToken', newRefreshToken, securityConfig.session.cookieOptions);

      await AuditLog.create(decoded.id, 'TOKEN_REFRESH', { 
        oldSessionId: decoded.sessionId, 
        newSessionId,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      res.json({
  accessToken: newAccessToken,
  user: {
    id: payload.id,
    email: payload.email,
    roles: payload.roles,
  },
});

    } catch (error) {
      logger.error('Token refresh error:', error);
      await AuditLog.create(null, 'TOKEN_REFRESH', { status: 'failed', error: error.message });
      res.status(500).json({ message: 'Token refresh failed' });
    }
  }
];

// Logout (unchanged, as it doesn't directly interact with User model)
exports.logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  try {
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, jwtConfig.refreshToken.secret);
      await redis.del(`session:${decoded.id}:${decoded.sessionId}`);
      await AuditLog.create(decoded.id, 'LOGOUT', { sessionId: decoded.sessionId });
    }
    res.clearCookie('refreshToken', securityConfig.session.cookieOptions);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.clearCookie('refreshToken', securityConfig.session.cookieOptions);
    await AuditLog.create(null, 'LOGOUT', { status: 'failed', error: error.message });
    res.status(500).json({ message: 'Logout failed' });
  }
};

// Request Password Reset
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (user) {
      const resetToken = uuidv4();
      await redis.set(`reset:${resetToken}`, user.id, 'EX', 30 * 60);

      const resetLink = `${process.env.BASE_URL}/auth/reset-password?token=${resetToken}`;
      await sendEmail(
        email, 
        'Password Reset', 
        'Click the link to Password Reset', 
        `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
      );

      await AuditLog.create(user.id, 'PASSWORD_RESET_REQUEST', { status: 'success' });
    }

    res.json({ message: 'If the email is registered, you will receive a reset link.' });
  } catch (error) {
    logger.error('Password reset request error:', error);
    await AuditLog.create(null, 'PASSWORD_RESET_REQUEST', { status: 'failed', error: error.message });
    res.status(500).json({ message: 'Password reset request failed' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;
  try {
    if (!validatePassword(newPassword)) {
      return res.status(400).json({ message: 'Password does not meet requirements' });
    }

    const userId = await redis.get(`reset:${token}`);
    if (!userId) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    await User.updatePassword(userId, newPassword);
    await redis.del(`reset:${token}`);

    await AuditLog.create(userId, 'PASSWORD_RESET', { status: 'success' });
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    logger.error('Password reset error:', error);
    await AuditLog.create(null, 'PASSWORD_RESET', { status: 'failed', error: error.message });
    res.status(500).json({ message: 'Password reset failed' });
  }
};