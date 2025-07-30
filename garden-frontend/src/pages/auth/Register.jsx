import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { AlertTriangle } from 'lucide-react';
import './Register.scss';

const Register = () => {
  const navigate = useNavigate();
  const { register, error, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
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

    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    }
    
    if (!formData.address) {
      errors.address = 'Address is required';
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
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Clear error when user starts typing
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
      await register(formData);
      navigate('/auth/login');
    } catch (err) {
      // Error is handled by the store
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Create an Account</h1>
          <p>Join our community garden network</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="error-message">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
              className={formErrors.name && touched.name ? 'error' : ''}
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={isLoading}
            />
            {formErrors.name && <span className="error-text">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              className={formErrors.email && touched.email ? 'error' : ''}
              placeholder="Enter your email address"
              autoComplete="email"
              disabled={isLoading}
            />
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
              className={formErrors.phone && touched.phone ? 'error' : ''}
              placeholder="Enter your phone number"
              autoComplete="tel"
              disabled={isLoading}
              pattern="[0-9]*"
            />
            {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, address: true }))}
              className={formErrors.address && touched.address ? 'error' : ''}
              placeholder="Enter your address"
              autoComplete="street-address"
              disabled={isLoading}
            />
            {formErrors.address && <span className="error-text">{formErrors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              className={formErrors.password && touched.password ? 'error' : ''}
              placeholder="Enter your password"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {formErrors.password && <span className="error-text">{formErrors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
              className={formErrors.confirmPassword && touched.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {formErrors.confirmPassword && (
              <span className="error-text">{formErrors.confirmPassword}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account? <Link to="/auth/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
