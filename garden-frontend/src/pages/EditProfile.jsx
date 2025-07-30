import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { 
  AlertTriangle, 
  Loader,
  Camera
} from 'lucide-react';
import './EditProfile.scss';

const EditProfile = () => {
  const navigate = useNavigate();
  const { 
    user, 
    updateProfile,
    updateProfilePicture,
    isLoading,
    error 
  } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });
  
  const [touched, setTouched] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      });
      setPreviewUrl(user.profilePicture || '');
    }
  }, [user]);

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

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // First update profile picture if changed
      if (profilePicture) {
        await updateProfilePicture(profilePicture);
      }
      
      // Then update profile information
      await updateProfile(formData);
      
      navigate('/profile', {
        state: { message: 'Profile updated successfully!' }
      });
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="edit-profile-loading">
        <Loader size={40} className="spinner" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-profile-error">
        <AlertTriangle size={40} />
        <h2>Error Loading Profile</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-btn"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <header className="edit-profile-header">
        <h1>Edit Profile</h1>
        <p>Update your personal information</p>
      </header>

      <div className="edit-profile-container">
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="profile-picture-section">
            <div className="picture-container">
              <img 
                src={previewUrl || '/placeholder-user.jpg'} 
                alt={formData.name}
                className="profile-picture" 
              />
              <label htmlFor="profile-picture" className="picture-upload">
                <Camera size={20} />
                <span>Change Picture</span>
                <input
                  type="file"
                  id="profile-picture"
                  accept="image/*"
                  onChange={handlePictureChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
              className={formErrors.name && touched.name ? 'error' : ''}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
            {formErrors.name && touched.name && (
              <span className="error-text">{formErrors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              className={formErrors.email && touched.email ? 'error' : ''}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            {formErrors.email && touched.email && (
              <span className="error-text">{formErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
              className={formErrors.phone && touched.phone ? 'error' : ''}
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
            {formErrors.phone && touched.phone && (
              <span className="error-text">{formErrors.phone}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, address: true }))}
              className={formErrors.address && touched.address ? 'error' : ''}
              placeholder="Enter your address"
              disabled={isLoading}
            />
            {formErrors.address && touched.address && (
              <span className="error-text">{formErrors.address}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/profile')}
              className="cancel-btn"
              disabled={isLoading}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
