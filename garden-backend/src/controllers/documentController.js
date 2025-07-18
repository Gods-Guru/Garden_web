const Document = require('../models/Document');

// Upload a document for verification
exports.uploadDocument = async (req, res) => {
  try {
    // Assume file upload middleware sets req.file.url
    const { type } = req.body;
    const userId = req.user._id;
    const url = req.file ? req.file.url : req.body.url;
    if (!url) return res.status(400).json({ success: false, error: 'No file uploaded' });
    const document = await Document.create({
      user: userId,
      type,
      url
    });
    res.status(201).json({ success: true, document });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Review a document (admin)
exports.reviewDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const document = await Document.findById(id);
    if (!document) return res.status(404).json({ success: false, error: 'Not found' });
    document.status = status;
    document.reviewedBy = req.user._id;
    document.reviewedAt = new Date();
    await document.save();
    res.json({ success: true, document });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get user documents
exports.getUserDocuments = async (req, res) => {
  try {
    const userId = req.user._id;
    const documents = await Document.find({ user: userId });
    res.json({ success: true, documents });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all documents (admin)
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find().populate('user reviewedBy');
    res.json({ success: true, documents });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
