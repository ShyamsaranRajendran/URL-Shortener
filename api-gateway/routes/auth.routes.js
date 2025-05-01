// In routes/auth.routes.js or similar
const { createProxyMiddleware } = require('http-proxy-middleware');

const authProxy = createProxyMiddleware({
  target: 'http://localhost:3001', // ✅ correct target
  changeOrigin: true,
  pathRewrite: { '^/auth': '' },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(502).json({ error: 'Proxy error' });
  },
});

module.exports = authProxy;
