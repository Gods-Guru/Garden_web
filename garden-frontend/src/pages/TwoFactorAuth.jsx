import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useNotificationStore from '../store/useNotificationStore';
import './TwoFactorAuth.scss';

const TwoFactorAuth = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [email, setEmail] = useState('');
  const [twoFactorMethod, setTwoFactorMethod] = useState('email');

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useAuthStore();
  const { showError, showSuccess } = useNotificationStore();

  useEffect(() => {
    // Get data from location state
    const { email: emailFromState, twoFactorMethod: methodFromState } = location.state || {};
    
    if (!emailFromState) {
      // No email found, redirect to login
      navigate('/login');
      return;
    }

    setEmail(emailFromState);
    setTwoFactorMethod(methodFromState || 'email');

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
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
          type: twoFactorMethod
        }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess(data.message);

        // Update auth store with token and user data
        const { user, token } = data.data;
        setUser(user);
        setToken(token);

        // Redirect to appropriate dashboard
        navigate(data.data.redirectTo || '/dashboard');
      } else {
        showError(data.message || '2FA verification failed');
        
        // Clear code on error
        setCode(['', '', '', '', '', '']);
        const firstInput = document.getElementById('code-0');
        if (firstInput) firstInput.focus();
      }
    } catch (error) {
      console.error('2FA verification error:', error);
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
          type: twoFactorMethod
        }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess(`2FA code sent to your ${twoFactorMethod}!`);
        setTimeLeft(300); // Reset timer to 5 minutes
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

  const getMethodIcon = () => {
    return twoFactorMethod === 'email' ? '📧' : '📱';
  };

  const getMethodText = () => {
    return twoFactorMethod === 'email' ? 'email' : 'phone';
  };

  return (
    <div className="two-factor-auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-icon">
            🔐
          </div>
          <h1>Two-Factor Authentication</h1>
          <p>We've sent a 6-digit security code to your {getMethodText()}</p>
          <div className="method-display">
            {getMethodIcon()} {twoFactorMethod === 'email' ? email : '***-***-****'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="code-input-container">
            <label>Enter security code</label>
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
              'Verify & Login'
            )}
          </button>
        </form>

        <div className="auth-footer">
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
              disabled={resending || timeLeft > 240} // Allow resend after 1 minute
            >
              {resending ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                `Resend to ${getMethodText()}`
              )}
            </button>
          </div>

          <div className="help-links">
            <button 
              onClick={() => navigate('/login')}
              className="link-button"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
