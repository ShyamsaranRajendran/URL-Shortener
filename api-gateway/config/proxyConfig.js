const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyConfig = (target, pathRewrite) => {
  return {
    target,
    changeOrigin: true,
    pathRewrite,
    secure: false, // use this if you're working locally with self-signed certs
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Gateway] Proxying ${req.method} ${req.url} to: ${target}${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      // Set CORS headers on response
      proxyRes.headers['Access-Control-Allow-Origin'] = ['http://localhost:5173','http://localhost:80'];
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    },
    onError: (err, req, res) => {
      console.error(`[Gateway] Error in proxying ${req.method} ${req.url}:`, err.message);
      res.status(502).json({ error: `${target} service is unavailable` });
    }
  };
};

module.exports = { proxyConfig };
