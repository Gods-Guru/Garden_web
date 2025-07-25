import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Validate required fields
      if (!form.name || !form.description || !form.address.street || !form.address.city || !form.address.state) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare data to match backend schema EXACTLY
      const coordinates = [0, 0]; // [longitude, latitude] - TODO: Add geocoding

      const gardenData = {
        name: form.name,
        description: form.description,
        location: {
          address: form.address.street,
          city: form.address.city,
          state: form.address.state,
          zipCode: form.address.zipCode,
          country: form.address.country || 'United States',
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

      // Debug: Log the data being sent (remove this in production)
      console.log('Sending garden data:', JSON.stringify(gardenData, null, 2));

      const res = await fetch('/api/gardens', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gardenData)
      });

      const data = await res.json();

      // Debug: Log the response
      console.log('Response status:', res.status);
      console.log('Response data:', data);

      if (!res.ok) {
        const errorMessage = data.message || data.error || `HTTP ${res.status}: Failed to create garden`;
        console.error('Garden creation failed:', errorMessage);
        throw new Error(errorMessage);
      }

      setSuccess(true);
      toast.success('Garden created successfully!');

      if (onGardenCreated) {
        onGardenCreated(data.data.garden);
      }

      // Navigate to gardens list or garden detail page
      navigate('/gardens');
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
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">Garden created successfully!</div>}
      
      <form onSubmit={handleSubmit}>
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
          <h3>Location</h3>
          <div className="form-group">
            <label htmlFor="address.street">Street Address*</label>
            <input 
              type="text" 
              id="address.street" 
              name="address.street" 
              value={form.address.street} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address.city">City*</label>
              <input 
                type="text" 
                id="address.city" 
                name="address.city" 
                value={form.address.city} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="address.state">State*</label>
              <input 
                type="text" 
                id="address.state" 
                name="address.state" 
                value={form.address.state} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address.zipCode">ZIP Code*</label>
              <input 
                type="text" 
                id="address.zipCode" 
                name="address.zipCode" 
                value={form.address.zipCode} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="address.country">Country*</label>
              <input 
                type="text" 
                id="address.country" 
                name="address.country" 
                value={form.address.country} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
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
      </form>
    </div>
  );
}

export default CreateGarden;
