// // controllers/authController.js
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const bcrypt = require('bcrypt');
// const { v4: uuidv4 } = require('uuid');
// const redis = require('../utils/redis');
// const sendEmail = require('../utils/sendEmail');
// const bruteForceProtection = require('../utils/antifraud');
// const sessionValidator = require('../utils/sessionValidation');
// const detectAnomalies = require('../utils/anomalyDetection');

// // Register new user
// exports.register = async (req, res) => {
//   const { name, email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

//   const userExists = await User.findByEmail(email);
//   if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

//   const user = await User.create(name, email, password);
//   const token = uuidv4();
//   await redis.set(`verify:${token}`, user.id, 'EX', 60 * 60);

//   const verifyLink = `${process.env.BASE_URL}/verify-email?token=${token}`;
//   await sendEmail(user.email, 'Verify your account', `Click this link to verify: ${verifyLink}`, `<p>Click <a href="${verifyLink}">here</a> to verify your email.</p>`);

//   res.status(201).json({ success: true, message: 'Check email to verify account' });
// };

// // Email verification
// exports.verifyEmail = async (req, res) => {
//   const { token } = req.query;
//   const userId = await redis.get(`verify:${token}`);
//   if (!userId) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

//   await User.markEmailVerified(userId);
//   await redis.del(`verify:${token}`);

//   res.json({ success: true, message: 'Email verified' });
// };

// // Request password reset
// exports.requestPasswordReset = async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findByEmail(email);
//   if (!user) return res.json({ success: true }); // If not found, return silently.

//   const token = uuidv4();
//   await redis.set(`reset:${token}`, user.id, 'EX', 30 * 60);
//   const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
//   await sendEmail(user.email, 'Reset your password', `Click this link to reset your password: ${resetLink}`, `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`);

//   res.json({ success: true, message: 'If the email is registered, you’ll receive a reset link' });
// };

// // Reset password
// exports.resetPassword = async (req, res) => {
//   const { newPassword } = req.body;
//   const { token } = req.query;
//   const userId = await redis.get(`reset:${token}`);
//   if (!userId) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

//   const hashed = await bcrypt.hash(newPassword, 10);
//   await User.updatePassword(userId, hashed);
//   await redis.del(`reset:${token}`);

//   res.json({ success: true, message: 'Password updated' });
// };

// // Login
// exports.login = [
//   bruteForceProtection, // Prevent brute-force attacks
//   async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findByEmail(email);
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ success: false, message: 'Invalid credentials' });
//     }

//     const payload = { id: user.id, email: user.email, roles: user.roles, verified: user.emailverified };
//     const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

//     const sessionId = uuidv4();
//     const refreshToken = jwt.sign({ ...payload, sessionId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

//     await redis.set(`session:${user.id}:${sessionId}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // expire in 7 days
//     res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

//     res.json({ success: true, accessToken, roles: user.roles });
//   },
// ];

// // Refresh Token
// exports.refreshToken = [
//   sessionValidator, // Validate session against IP/User-Agent
//   detectAnomalies,  // Detect if login is from a new device/IP
//   async (req, res) => {
//     const oldToken = req.cookies.refreshToken;
//     if (!oldToken) return res.status(401).json({ success: false, message: 'No token provided' });

//     try {
//       const decoded = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET);
//       const sessionKey = `session:${decoded.id}:${decoded.sessionId}`;
//       const sessionExists = await redis.get(sessionKey);
//       if (!sessionExists) return res.status(403).json({ success: false, message: 'Session expired or invalid' });

//       const newRefreshToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
//       const accessToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: '15m' });

//       const metadata = JSON.parse(sessionExists); // preserve session metadata
//       const newSessionKey = `session:${decoded.id}:${newRefreshToken}`;

//       await redis.multi()
//         .del(sessionKey)
//         .set(newSessionKey, JSON.stringify(metadata), 'EX', 7 * 24 * 60 * 60)
//         .exec();

//       res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
//       res.json({ success: true, accessToken });
//     } catch (err) {
//       res.status(403).json({ success: false, message: 'Invalid token' });
//     }
//   },
// ];

// // Force Logout by Admin
// exports.forceLogout = async (req, res) => {
//   const { userId } = req.params;
//   if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });

//   const keys = await redis.keys(`session:${userId}:*`);
//   if (keys.length) await redis.del(...keys);
//   res.json({ success: true, message: `User ${userId} sessions revoked` });
// };


// exports.verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   const userId = await redis.get(`verify:${token}`);
//   if (!userId) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

//   await User.markEmailVerified(userId);
//   await redis.del(`verify:${token}`);

//   res.json({ success: true, message: 'Email verified' });
// };

// exports.requestPasswordReset = async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findByEmail(email);
//   if (!user) return res.json({ success: true }); 
//   const token = uuidv4();
//   await redis.set(`reset:${token}`, user.id, 'EX', 60 * 30); 
//   const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
//   await sendEmail(
//     user.email,
//     'Verify your account',
//     `Click this link to verify: ${resetLink}`,
//     `<p>Click <a href="${resetLink}">here</a> to verify your email.</p>`
//   );
//   res.json({ success: true, message: 'If the email is registered, you’ll receive a reset link' });
// };

// exports.resetPassword = async (req, res) => {
//   const { newPassword } = req.body;
//   const { token } = req.query;
//   const userId = await redis.get(`reset:${token}`);
//   if (!userId) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

//   const hashed = await bcrypt.hash(newPassword, 10);
//   await User.updatePassword(userId, hashed);
//   await redis.del(`reset:${token}`);

//   res.json({ success: true, message: 'Password updated' });
// };


// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findByEmail(email);
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).json({ success: false, message: 'Invalid credentials' });
//   }

//   const payload = { id: user.id, email: user.email, roles: user.roles, verified: user.emailverified };

//   const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

//   const sessionId = uuidv4();
//   const refreshToken = jwt.sign({ ...payload, sessionId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

//   await redis.set(`session:${user.id}:${sessionId}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // expire in 7 days

//   res
//     .cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'Strict',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     })
//     .json({ success: true, accessToken, roles: user.roles });
// };



// exports.storeSession = async (userId, token, req) => {
//   const sessionKey = `session:${userId}:${token}`;
//   const metadata = {
//     ip: req.ip,
//     userAgent: req.headers['user-agent'],
//     createdAt: new Date().toISOString()
//   };
//   await redis.set(sessionKey, JSON.stringify(metadata), 'EX', 7 * 24 * 60 * 60);
// };

// exports.listSessions = async (req, res) => {
//   const userId = req.user.id;
//   const keys = await redis.keys(`session:${userId}:*`);
//   const sessions = await Promise.all(keys.map(async key => ({
//     token: key.split(':')[2],
//     metadata: JSON.parse(await redis.get(key))
//   })));
//   res.json({ success: true, sessions });
// };


// exports.logoutAllDevices = async (req, res) => {
//   const userId = req.user.id;
//   const keys = await redis.keys(`session:${userId}:*`);
//   if (keys.length) await redis.del(...keys);
//   res.clearCookie('refreshToken');
//   res.json({ success: true, message: 'Logged out from all devices' });
// };


// exports.logout = async (req, res) => {
//   try {
//     const refreshToken = req.cookies.refreshToken;
//     if (refreshToken) {
//       const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//       const key = `session:${decoded.id}:${decoded.sessionId}`;
//       await redis.del(key);
//     }
//   } catch (err) {
//     console.error('Logout error (token may be expired):', err.message);
//   }

//   res.clearCookie('refreshToken', {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'Strict',
//   });
//   res.json({ success: true, message: 'Logged out' });
// };

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { storeSession } = require('../utils/sessionUtils');
const { sendAuthEvent, sendAuditEvent } = require('../services/kafkaProducer');
const jwtConfig = require('../config/jwt');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await sendAuthEvent({
        action: 'REGISTER_ATTEMPT',
        status: 'failed',
        reason: 'email_exists',
        email
      });
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password });
    
    await sendAuthEvent({
      action: 'REGISTER',
      status: 'success',
      userId: user.id,
      email
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    await sendAuthEvent({
      action: 'REGISTER',
      status: 'failed',
      error: error.message
    });
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      await sendAuthEvent({
        action: 'LOGIN_ATTEMPT',
        status: 'failed',
        reason: 'invalid_credentials',
        email
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { 
      id: user.id, 
      email: user.email, 
      roles: user.roles 
    };

    const accessToken = jwt.sign(payload, jwtConfig.accessToken.secret, { 
      expiresIn: jwtConfig.accessToken.expiresIn 
    });

    const sessionId = uuidv4();
    const refreshToken = jwt.sign(
      { ...payload, sessionId },
      jwtConfig.refreshToken.secret,
      { expiresIn: jwtConfig.refreshToken.expiresIn }
    );

    await storeSession(user.id, sessionId, req);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    await sendAuditEvent({
      action: 'LOGIN',
      userId: user.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: {
        sessionId,
        authMethod: 'password'
      }
    });

    res.json({ 
      accessToken, 
      user: { id: user.id, email: user.email, roles: user.roles } 
    });
  } catch (error) {
    await sendAuthEvent({
      action: 'LOGIN',
      status: 'failed',
      error: error.message
    });
    res.status(500).json({ message: 'Login failed' });
  }
};

// Other controller methods follow similar pattern...
