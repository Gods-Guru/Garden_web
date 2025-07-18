import React, { useState } from 'react';
import API from '../../api';
import './AIAssistant.scss';

const AIAssistant = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnswer('');
    try {
      const res = await API.post('/ai-assistant/ask', { question });
      setAnswer(res.data.aiEntry.answer);
      setHistory(prev => [{ question, answer: res.data.aiEntry.answer }, ...prev]);
      setQuestion('');
    } catch (err) {
      setAnswer('Error getting answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant">
      <h2>AI Gardening Assistant</h2>
      <form onSubmit={handleAsk} className="ai-form">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask a gardening question..."
          required
        />
        <button type="submit" disabled={loading || !question}>Ask</button>
      </form>
      {loading && <div className="ai-loading">Thinking...</div>}
      {answer && <div className="ai-answer"><strong>Answer:</strong> {answer}</div>}
      {history.length > 0 && (
        <div className="ai-history">
          <h3>History</h3>
          <ul>
            {history.map((h, i) => (
              <li key={i}><strong>Q:</strong> {h.question}<br /><strong>A:</strong> {h.answer}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
