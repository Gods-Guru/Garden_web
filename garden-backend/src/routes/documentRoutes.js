const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/auth');
// You should use a file upload middleware like multer in production

// Upload document
router.post('/upload', auth, documentController.uploadDocument);

// Review document (admin)
router.patch('/:id/review', auth, documentController.reviewDocument);

// Get user documents
router.get('/my', auth, documentController.getUserDocuments);

// Get all documents (admin)
router.get('/', auth, documentController.getAllDocuments);

module.exports = router;
