const express = require('express');
const router = express.Router();
const {shortenUrl,redirectUrl,deleteUrl,updateUrl,getUrlInfo,getUserUrls} = require('../controllers/url.controller.js');
const { authenticate } = require('../middlewares/auth');
const cacheMiddleware = require('../middlewares/cache');

router.post('/shorten', shortenUrl);
router.get('/:code', redirectUrl);
router.delete('/:code', deleteUrl);

// Optional routes
router.get('/info/:code', cacheMiddleware('url-info'), getUrlInfo);
router.put('/update/:code', authenticate, updateUrl);
router.get('/user/urls', authenticate, getUserUrls);

module.exports = router;