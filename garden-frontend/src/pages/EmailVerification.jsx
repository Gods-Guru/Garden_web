import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useNotificationStore from '../store/useNotificationStore';
import './EmailVerification.scss';

const EmailVerification = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { showError, showSuccess } = useNotificationStore();

  useEffect(() => {
    // Get email from location state or localStorage
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem('pendingVerificationEmail');
    
    if (emailFromState) {
      setEmail(emailFromState);
      localStorage.setItem('pendingVerificationEmail', emailFromState);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      // No email found, redirect to register
      navigate('/register');
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location.state, navigate]);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    
    // Focus the next empty input or last input
    const nextEmptyIndex = newCode.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    const inputToFocus = document.getElementById(`code-${focusIndex}`);
    if (inputToFocus) inputToFocus.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      showError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode
        }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess(data.message);

        // Store token and user data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.removeItem('pendingVerificationEmail');

        // Redirect to appropriate dashboard
        navigate(data.data.redirectTo || '/dashboard');
      } else {
        showError(data.message || 'Verification failed');
        
        // Clear code on error
        setCode(['', '', '', '', '', '']);
        const firstInput = document.getElementById('code-0');
        if (firstInput) firstInput.focus();
      }
    } catch (error) {
      console.error('Verification error:', error);
      showError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: 'email'
        }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Verification code sent! Check your email.');
        setTimeLeft(600); // Reset timer to 10 minutes
        setCode(['', '', '', '', '', '']); // Clear current code
      } else {
        showError(data.message || 'Failed to resend code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      showError('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    const maskedUsername = username.length > 2 
      ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
      : username;
    return `${maskedUsername}@${domain}`;
  };

  return (
    <div className="email-verification-page">
      <div className="verification-container">
        <div className="verification-header">
          <div className="verification-icon">
            📧
          </div>
          <h1>Verify Your Email</h1>
          <p>We've sent a 6-digit verification code to</p>
          <div className="email-display">
            {maskEmail(email)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="verification-form">
          <div className="code-input-container">
            <label>Enter verification code</label>
            <div className="code-inputs">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="code-input"
                  maxLength="1"
                  pattern="[0-9]"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="verify-button"
            disabled={loading || code.join('').length !== 6}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        <div className="verification-footer">
          <div className="timer">
            {timeLeft > 0 ? (
              <span>Code expires in {formatTime(timeLeft)}</span>
            ) : (
              <span className="expired">Code has expired</span>
            )}
          </div>

          <div className="resend-section">
            <p>Didn't receive the code?</p>
            <button 
              onClick={handleResend}
              className="resend-button"
              disabled={resending || timeLeft > 540} // Allow resend after 1 minute
            >
              {resending ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Resend Code'
              )}
            </button>
          </div>

          <div className="help-links">
            <button 
              onClick={() => navigate('/register')}
              className="link-button"
            >
              ← Back to Registration
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="link-button"
            >
              Already verified? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
