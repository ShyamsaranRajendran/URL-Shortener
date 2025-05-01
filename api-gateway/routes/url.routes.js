// routes/url.routes.js
const { createProxyMiddleware } = require('http-proxy-middleware');
const { urlService } = require('../config/services');

module.exports = createProxyMiddleware({
  target: urlService,
  changeOrigin: true,
  pathRewrite: {
    '^/url': '', // Remove /url prefix before forwarding
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] Forwarding request to ${urlService}${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(502).json({ error: 'URL service unavailable' });
  },
});
