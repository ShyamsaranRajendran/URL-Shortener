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
const cors = require('cors');
const helmet = require('helmet');

app.use(requestLogger);
app.use(rateLimiter); 
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));
// app.use(cors({
//   origin:['http://localhost:5173','http://localhost:80'],
//   credentials: true
// }));
app.use(helmet());
app.use('/auth', createProxyMiddleware(proxyConfig(USER_SERVICE_URL, { '^/auth': '' })));
app.use('/url', createProxyMiddleware(proxyConfig(URL_SERVICE_URL, { '^/url': '' })));

app.use(healthRoute);

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
});
 