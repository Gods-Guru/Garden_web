import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/useAuthStore';
import LocationPicker from '../../components/maps/LocationPicker';
import './CreateGarden.scss';

// Helper function to parse rules from textarea input
const parseRules = (rulesText) => {
  if (!rulesText || !rulesText.trim()) {
    return [];
  }

  // Split by lines and filter out empty lines
  const lines = rulesText.split('\n').filter(line => line.trim());

  return lines.map((line, index) => {
    const trimmedLine = line.trim();

    // Check if line starts with a number (e.g., "1. Rule text")
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s*(.+)$/);
    if (numberedMatch) {
      return {
        title: `Rule ${numberedMatch[1]}`,
        description: numberedMatch[2].trim()
      };
    }

    // Check if line starts with a bullet point (e.g., "• Rule text" or "- Rule text")
    const bulletMatch = trimmedLine.match(/^[•\-\*]\s*(.+)$/);
    if (bulletMatch) {
      return {
        title: `Rule ${index + 1}`,
        description: bulletMatch[1].trim()
      };
    }

    // Default: treat each line as a separate rule
    return {
      title: `Rule ${index + 1}`,
      description: trimmedLine
    };
  });
};

function CreateGarden({ onGardenCreated }) {
  const navigate = useNavigate();
  const { token, user, isAuthenticated, logout, validateToken } = useAuthStore();
  const [form, setForm] = useState({
    name: '',
    description: '',
    totalArea: 1000,
    totalPlots: 20,
    plotSize: {
      width: 10,
      height: 10
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    settings: {
      isPublic: true,
      allowMembers: true,
      membershipFee: 0,
      plotSizes: [],
      rules: ''
    },
    contact: {
      email: '',
      phone: '',
      website: ''
    }
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdGardenId, setCreatedGardenId] = useState(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setForm(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };



  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Check authentication
      if (!isAuthenticated || !token) {
        throw new Error('Authentication required. Please log in.');
      }



      // Validate required fields
      if (!form.name || !form.description) {
        throw new Error('Please fill in all required fields');
      }

      // Validate location is selected
      if (!selectedLocation) {
        setLocationError('Please select a location for your garden');
        throw new Error('Please select a location for your garden');
      }

      // Prepare data to match backend schema EXACTLY
      const coordinates = [selectedLocation.lng, selectedLocation.lat]; // [longitude, latitude]

      const gardenData = {
        name: form.name,
        description: form.description,
        location: {
          address: selectedLocation.address,
          coordinates: {
            type: 'Point',
            coordinates: coordinates
          }
        },
        geo: {
          type: 'Point',
          coordinates: coordinates
        },
        totalArea: parseInt(form.totalArea) || 1000,
        totalPlots: parseInt(form.totalPlots) || 20,
        plotSize: {
          width: parseInt(form.plotSize.width) || 10,
          height: parseInt(form.plotSize.height) || 10
        },
        rules: parseRules(form.settings.rules)
      };



      const res = await fetch('/api/gardens', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gardenData)
      });

      const data = await res.json();



      if (!res.ok) {
        const errorMessage = data.message || data.error || `HTTP ${res.status}: Failed to create garden`;


        // Handle authentication errors specifically
        if (res.status === 401 || (data.code && ['INVALID_TOKEN', 'TOKEN_EXPIRED', 'NO_TOKEN'].includes(data.code))) {
          const errorMsg = `Authentication error: ${data.message || data.error || 'Invalid token'}`;
          setError(errorMsg);
          return;
        }

        throw new Error(errorMessage);
      }

      setSuccess(true);
      setCreatedGardenId(data.data.garden._id);
      toast.success('Garden created successfully!');

      // Refresh user data to include the new garden
      try {
        await validateToken(); // This will refresh the user data
      } catch (refreshError) {
        // Silently handle refresh error
      }

      if (onGardenCreated) {
        onGardenCreated(data.data.garden);
      }

      // Don't auto-navigate, let user test permissions first
      // setTimeout(() => {
      //   navigate(`/gardens/${data.data.garden._id}/manage`);
      // }, 1500);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-garden-form">
      <h2>Create a New Garden</h2>
      {error && (
        <div className="form-error">
          {error}
          {error.includes('Authentication error') && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              Try <button
                type="button"
                onClick={() => { logout(); navigate('/login'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                logging out and back in
              </button>
            </div>
          )}
        </div>
      )}
      {success && (
        <div>
          <div className="form-success">
            Garden created successfully! 🎉
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => navigate(`/gardens/${createdGardenId}/manage`)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  marginRight: '1rem'
                }}
              >
                Manage Garden →
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {!success && <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="name">Garden Name*</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalArea">Total Garden Area (sq ft)*</label>
            <input
              type="number"
              id="totalArea"
              name="totalArea"
              value={form.totalArea}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalPlots">Number of Plots*</label>
            <input
              type="number"
              id="totalPlots"
              name="totalPlots"
              value={form.totalPlots}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Plot Size (feet)*</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="plotWidth">Width</label>
                <input
                  type="number"
                  id="plotWidth"
                  name="plotSize.width"
                  value={form.plotSize.width}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="plotHeight">Height</label>
                <input
                  type="number"
                  id="plotHeight"
                  name="plotSize.height"
                  value={form.plotSize.height}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="images">Garden Images</label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="form-section">
          <LocationPicker
            onLocationSelect={(location) => {
              setSelectedLocation(location);
              setLocationError('');
            }}
            initialLocation={selectedLocation}
            required={true}
            error={locationError}
          />
        </div>

        <div className="form-section">
          <h3>Settings</h3>
          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="settings.isPublic" 
              name="settings.isPublic" 
              checked={form.settings.isPublic} 
              onChange={handleChange} 
            />
            <label htmlFor="settings.isPublic">Make this garden public</label>
          </div>

          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="settings.allowMembers" 
              name="settings.allowMembers" 
              checked={form.settings.allowMembers} 
              onChange={handleChange} 
            />
            <label htmlFor="settings.allowMembers">Allow new members to join</label>
          </div>

          <div className="form-group">
            <label htmlFor="settings.membershipFee">Membership Fee (USD)</label>
            <input 
              type="number" 
              id="settings.membershipFee" 
              name="settings.membershipFee" 
              value={form.settings.membershipFee} 
              onChange={handleChange} 
              min="0" 
              step="0.01" 
            />
          </div>

          <div className="form-group">
            <label htmlFor="settings.rules">Garden Rules</label>
            <textarea
              id="settings.rules"
              name="settings.rules"
              value={form.settings.rules}
              onChange={handleChange}
              placeholder="Enter garden rules, one per line. Examples:&#10;1. Be civil and respectful&#10;2. Be punctual&#10;3. Have fun and grow!&#10;&#10;You can use numbers, bullets (•, -, *), or plain text."
              rows="6"
            />
            <small className="form-help">
              Each line will become a separate rule. You can use numbered lists (1. 2. 3.),
              bullet points (• - *), or plain text.
            </small>

            {/* Rules Preview */}
            {form.settings.rules && (
              <div className="rules-preview">
                <h4>Rules Preview:</h4>
                <div className="preview-rules">
                  {parseRules(form.settings.rules).map((rule, index) => (
                    <div key={index} className="preview-rule">
                      <strong>{rule.title}:</strong> {rule.description}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-group">
            <label htmlFor="contact.email">Contact Email*</label>
            <input 
              type="email" 
              id="contact.email" 
              name="contact.email" 
              value={form.contact.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact.phone">Contact Phone</label>
            <input 
              type="tel" 
              id="contact.phone" 
              name="contact.phone" 
              value={form.contact.phone} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact.website">Website</label>
            <input 
              type="url" 
              id="contact.website" 
              name="contact.website" 
              value={form.contact.website} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Garden'}
          </button>
        </div>
      </form>}
    </div>
  );
}

export default CreateGarden;
