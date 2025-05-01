const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { proxyConfig } = require('./config/proxyConfig');
const { USER_SERVICE_URL, URL_SERVICE_URL } = require('./config/services');
const requestLogger = require('./middlewares/requestLogger');
const healthRoute = require('./routes/health');
const errorHandler = require('./utils/errorHandler');
const rateLimiter = require('./middlewares/rateLimit');
const authenticate = require('./middlewares/auth'); // ⛔ Import the authentication middleware
const app = express();

app.use(requestLogger);
app.use(rateLimiter); 

app.use('/auth', createProxyMiddleware(proxyConfig(USER_SERVICE_URL, { '^/auth': '' })));
app.use('/url', createProxyMiddleware(proxyConfig(URL_SERVICE_URL, { '^/url': '' })));

app.use(healthRoute);

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
});
