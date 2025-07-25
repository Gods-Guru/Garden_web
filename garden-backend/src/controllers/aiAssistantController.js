const OpenAI = require('openai/index.js');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const AIAssistant = require('../models/AIAssistant');

// Ask a gardening question (stub for AI integration)
exports.askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.user._id;
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: question }],
    });
    const answer = completion.choices[0].message.content;
    const aiEntry = await AIAssistant.create({ user: userId, question, answer });
    res.status(201).json({ success: true, aiEntry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get user AI assistant history
exports.getUserAIHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await AIAssistant.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
