import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { AlertTriangle, Mail } from 'lucide-react';
import './ForgotPassword.scss';

const ForgotPassword = () => {
  const { requestPasswordReset, error, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const validateEmail = () => {
    if (!email) {
      return 'Email is required';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateEmail();
    if (error) {
      setFormError(error);
      return;
    }

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      // Error is handled by the store
      console.error('Password reset request failed:', err);
    }
  };

  if (success) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <div className="success-message">
            <Mail size={48} />
            <h2>Check Your Email</h2>
            <p>
              We've sent password reset instructions to {email}. Please check your
              inbox and follow the link to reset your password.
            </p>
            <p className="note">
              Don't see the email? Check your spam folder or{' '}
              <button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="resend-link"
              >
                click here to resend
              </button>
            </p>
            <Link to="/auth/login" className="back-to-login">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <h1>Reset Your Password</h1>
          <p>Enter your email address to receive password reset instructions</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          {error && (
            <div className="error-message">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFormError('');
              }}
              onBlur={() => setTouched(true)}
              className={formError && touched ? 'error' : ''}
              placeholder="Enter your email address"
              autoComplete="email"
              disabled={isLoading}
            />
            {formError && touched && (
              <span className="error-text">{formError}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Sending Instructions...' : 'Send Instructions'}
          </button>
        </form>

        <div className="forgot-password-footer">
          <Link to="/auth/login" className="back-link">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
