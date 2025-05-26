const UrlService = require('../services/urlservice');

exports.shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;
    if (!originalUrl || !/^https?:\/\/\S+$/.test(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const url = await UrlService.shortenUrl(originalUrl, customAlias, req.user?.id, expiresAt);
    res.status(201).json(url);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;
    console.log('Redirecting URL with code:', code);

    const url = await UrlService.getUrl(code);

    // if (!url) {
    //   console.warn(`URL not found: ${code}`);
    //   return res.redirect('http://localhost:5173/not-found');
    // }

    await UrlService.incrementClicks(code); // Move this after URL check
    console.log(url)
    const { original_url: originalUrl } = url;
    console.log('Redirecting to:', originalUrl);
    res.redirect(301, originalUrl);
  } catch (error) {
    console.error('Error in redirectUrl controller:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.deleteUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await UrlService.deleteUrl(code, req.user?.id);

    if (!result) return res.status(404).json({ error: 'URL not found or unauthorized' });

    res.status(200).json({ message: 'URL deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUrlInfo = async (req, res) => {
  try {
    const { code } = req.params;
    const url = await UrlService.getUrlInfo(code);

    if (!url) return res.status(404).json({ error: 'URL not found' });

    res.status(200).json(url);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const { originalUrl, expiresAt } = req.body;

    const updated = await UrlService.updateUrl(code, req.user?.id, { originalUrl, expiresAt });

    if (!updated) return res.status(404).json({ error: 'URL not found or unauthorized' });

    res.status(200).json({ message: 'URL updated', data: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserUrls = async (req, res) => {
  try {
    const urls = await UrlService.getUserUrls(req.user.id);
    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUrls = async (req, res) => {
  try {
    const urls = await UrlService.getAllUrls();
     res.json({ success: true, data: urls });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

