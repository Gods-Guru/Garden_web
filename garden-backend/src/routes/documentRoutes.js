const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { requireAuth } = require('../middleware/auth');
// You should use a file upload middleware like multer in production

// Upload document
router.post('/upload', requireAuth, documentController.uploadDocument);

// Review document (admin)
router.patch('/:id/review', requireAuth, documentController.reviewDocument);

// Get user documents
router.get('/my', requireAuth, documentController.getUserDocuments);

// Get all documents (admin)
router.get('/', requireAuth, documentController.getAllDocuments);

module.exports = router;
