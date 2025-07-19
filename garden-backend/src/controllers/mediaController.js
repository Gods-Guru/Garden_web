const Media = require('../models/Media');

// Upload media (image, video, document)
exports.uploadMedia = async (req, res) => {
  try {
    // Assume file upload middleware sets req.file.url
    const { garden, plot, type, description } = req.body;
    const userId = req.user._id;
    const url = req.file ? req.file.url : req.body.url;
    if (!url) return res.status(400).json({ success: false, error: 'No file uploaded' });
    const media = await Media.create({
      uploader: userId,
      garden,
      plot,
      url,
      type,
      description
    });
    res.status(201).json({ success: true, media });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get media for a garden or plot
exports.getMedia = async (req, res) => {
  try {
    const { garden, plot } = req.query;
    const filter = {};
    if (garden) filter.garden = garden;
    if (plot) filter.plot = plot;
    const media = await Media.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, media });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
