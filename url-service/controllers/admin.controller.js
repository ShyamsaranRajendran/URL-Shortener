const UrlService = require('../services/urlservice');
const { query } = require('../config/db');

exports.getAllUrls = async (req, res) => {
  try {
    const result = await query('SELECT * FROM urls');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.forceDeleteUrl = async (req, res) => {
  try {
    const { code } = req.params;
    await query('DELETE FROM urls WHERE short_code = $1', [code]);
    await CacheService.del(`url:${code}`);
    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add other admin controller methods