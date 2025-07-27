// Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useNotificationStore from '../store/useNotificationStore';
import '../styles/pagestyles/Auth.scss';

// Temporary SVG icons while fixing react-icons dependency
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const LoaderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spinner">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <circle cx="12" cy="16" r="1"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);


function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, isAuthenticated } = useAuthStore();
  const { showError, showSuccess } = useNotificationStore();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Show success message from registration
  useEffect(() => {
    if (location.state?.message) {
      showSuccess(location.state.message);
      // Pre-fill email if provided
      if (location.state.email) {
        setForm(prev => ({ ...prev, email: location.state.email }));
      }
    }
  }, [location.state, showSuccess]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear errors when user starts typing
    if (loginError) setLoginError('');
  };

  const validate = () => {
    if (!form.email.trim() || !form.password.trim()) {
      setLoginError('Both email and password are required.');
      return false;
    }
    if (!/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
      setLoginError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!validate()) return;

    setLoginLoading(true);

    try {
      const result = await login({
        email: form.email,
        password: form.password
      });

      if (result.success) {
        if (result.requires2FA) {
          // Redirect to 2FA verification
          showSuccess(result.message);
          navigate('/two-factor-auth', {
            state: {
              email: result.email,
              twoFactorMethod: result.twoFactorMethod,
              from: location.state?.from
            }
          });
        } else {
          // Successful login without 2FA
          showSuccess('Welcome back!');
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }
      } else {
        setLoginError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Network error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-hero">
        <div className="hero-content">
          <h1>Welcome Back to <span>Rooted</span></h1>
          <p>Connect with your gardening community and manage your plots</p>
          <div className="hero-image image-placeholder"></div>
        </div>
      </div>
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>Sign In</h2>
            <p>Enter your details to access your account</p>
          </div>
          {loginError && <div className="auth-error">{loginError}</div>}
            <div className="form-group">
              <label htmlFor="email">
                <MailIcon className="label-icon" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                <LockIcon className="label-icon" />
                Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="auth-btn" disabled={loginLoading}>
              {loginLoading ? (
                <>
                  <LoaderIcon />
                  Signing In...
                </>
              ) : 'Sign In'}
            </button>
          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;