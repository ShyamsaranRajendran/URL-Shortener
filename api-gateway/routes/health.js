const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.send('API Gateway is up and running');
});

module.exports = router;
