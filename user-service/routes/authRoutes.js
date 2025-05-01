const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  refreshToken,
  logout
} = require('../controllers/authController'); // Ensure these methods are properly exported from authController
// const authMiddleware = require('../middlewares/authMiddleware'); // Ensure authMiddleware is correctly exported and is a function
// const { listSessions, logoutAllDevices, forceLogout } = require('../controllers/sessionController'); // Ensure these methods are correctly exported from sessionController

// Route for registering a new user
router.post('/register', register);

// Route for logging in a user
router.post('/login', login);

// Route for email verification (GET)
router.get('/verify-email', verifyEmail);

// Route for requesting a password reset
router.post('/request-password-reset', requestPasswordReset);

// Route for resetting the password
router.post('/reset-password', resetPassword);

// Route for refreshing the JWT token
router.post('/refresh-token', refreshToken);

// // Route for listing active sessions, requires authentication middleware
// router.get('/sessions', authMiddleware, listSessions);

// // Route for logging out from all devices, requires authentication middleware
// router.post('/logout-all', authMiddleware, logoutAllDevices);

// // Route for forcefully logging out a user as an admin, requires authentication middleware
// router.post('/admin/force-logout/:userId', authMiddleware, forceLogout);

// Route for logging out the current session
router.post('/logout', logout);

module.exports = router;
