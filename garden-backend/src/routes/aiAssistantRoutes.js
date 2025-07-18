const express = require('express');
const router = express.Router();
const aiAssistantController = require('../controllers/aiAssistantController');
const auth = require('../middleware/auth');

// Ask a gardening question
router.post('/ask', auth, aiAssistantController.askQuestion);

// Get user AI assistant history
router.get('/my', auth, aiAssistantController.getUserAIHistory);

module.exports = router;
