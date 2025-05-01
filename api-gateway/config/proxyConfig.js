const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyConfig = (target, pathRewrite) => {
  return {
    target,
    changeOrigin: true,
    pathRewrite,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Gateway] Proxying ${req.method} ${req.url} to: ${target}${req.url}`);
    },
    onError: (err, req, res) => {
      console.error(`[Gateway] Error in proxying ${req.method} ${req.url}:`, err.message);
      res.status(502).json({ error: `${target} service is unavailable` });
    }
  };
};

module.exports = { proxyConfig };
