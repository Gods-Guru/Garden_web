import { useState } from 'react';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError('Feedback cannot be empty.');
      return;
    }
    setError('');
    // Simulate API call
    setTimeout(() => setSuccess(true), 500);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Feedback form">
      <label htmlFor="feedback">Your Feedback</label>
      <textarea
        id="feedback"
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        aria-required="true"
        aria-invalid={!!error}
      />
      {error && <div role="alert" style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Submit</button>
      {success && <div role="status" style={{ color: 'green' }}>Thank you for your feedback!</div>}
    </form>
  );
}
