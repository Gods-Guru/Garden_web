import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { AlertTriangle, Lock } from 'lucide-react';
import './ResetPassword.scss';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, error, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    // Here you would typically verify the token with your backend
    // For now, we'll just check if it exists
    if (!token) {
      setTokenValid(false);
    }
  }, [token]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await resetPassword(token, formData.password);
      // Redirect to login with success message
      navigate('/auth/login', { 
        state: { 
          message: 'Password reset successful. Please log in with your new password.' 
        } 
      });
    } catch (err) {
      // Error is handled by the store
      console.error('Password reset failed:', err);
    }
  };

  if (!tokenValid) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="invalid-token">
            <Lock size={48} />
            <h2>Invalid or Expired Link</h2>
            <p>
              The password reset link is invalid or has expired. Please request a
              new password reset link.
            </p>
            <Link to="/auth/forgot-password" className="request-link">
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-header">
          <h1>Reset Your Password</h1>
          <p>Please enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
          {error && (
            <div className="error-message">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              className={formErrors.password && touched.password ? 'error' : ''}
              placeholder="Enter your new password"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {formErrors.password && touched.password && (
              <span className="error-text">{formErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
              className={formErrors.confirmPassword && touched.confirmPassword ? 'error' : ''}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {formErrors.confirmPassword && touched.confirmPassword && (
              <span className="error-text">{formErrors.confirmPassword}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="reset-password-footer">
          <Link to="/auth/login" className="back-link">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
