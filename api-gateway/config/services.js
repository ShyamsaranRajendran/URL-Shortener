require('dotenv').config();
module.exports = {
    USER_SERVICE_URL: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    URL_SERVICE_URL: process.env.URL_SERVICE_URL || 'http://localhost:3002',
  };
  