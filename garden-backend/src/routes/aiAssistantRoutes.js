const express = require('express');
const router = express.Router();
const aiAssistantController = require('../controllers/aiAssistantController');
const { requireAuth } = require('../middleware/auth');

// Ask a gardening question
router.post('/ask', requireAuth, aiAssistantController.askQuestion);

// Get user AI assistant history
router.get('/my', requireAuth, aiAssistantController.getUserAIHistory);

module.exports = router;
