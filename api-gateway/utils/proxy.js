const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (target) => createProxyMiddleware({
  target,
  changeOrigin: true,
  xfwd: true, // Forward headers
});