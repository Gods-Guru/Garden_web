import React, { useEffect, useState } from 'react';
import './Feedback.scss';
import API from '../../api';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ message: '', rating: 5 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await API.get('/feedback');
      setFeedbacks(res.data);
    } catch (err) {
      setError('Failed to load feedback.');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await API.post('/feedback', form);
      setSuccess('Feedback submitted!');
      setForm({ message: '', rating: 5 });
      fetchFeedbacks();
    } catch (err) {
      setError('Failed to submit feedback.');
    }
    setLoading(false);
  };

  return (
    <div className="feedback-container">
      <h2>Feedback</h2>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your feedback..."
          required
        />
        <label>
          Rating:
          <select name="rating" value={form.rating} onChange={handleChange}>
            {[1,2,3,4,5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={loading}>Submit</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
      <div className="feedback-list">
        <h3>Recent Feedback</h3>
        {loading ? <p>Loading...</p> : (
          feedbacks.length === 0 ? <p>No feedback yet.</p> : (
            <ul>
              {feedbacks.map(fb => (
                <li key={fb._id}>
                  <div className="fb-message">{fb.message}</div>
                  <div className="fb-meta">Rating: {fb.rating} | By: {fb.user?.name || 'Anonymous'}</div>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
};

export default Feedback;
