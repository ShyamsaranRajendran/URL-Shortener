const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, isAdmin } = require('../middlewares/auth');

router.get('/all', authenticate, isAdmin, adminController.getAllUrls);
router.delete('/:code', authenticate, isAdmin, adminController.forceDeleteUrl);
// router.post('/ban-domain', authenticate, isAdmin, adminController.banDomain);

module.exports = router;