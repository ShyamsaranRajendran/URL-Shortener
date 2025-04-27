// routes/authRoutes.js
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
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail); 
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword); 
router.post('/refresh-token',refreshToken );
router.get('/sessions', authMiddleware, listSessions);
router.post('/logout-all', authMiddleware, logoutAllDevices);
router.post('/admin/force-logout/:userId', authMiddleware, forceLogout);
router.post('logout',logout)
module.exports = router;
