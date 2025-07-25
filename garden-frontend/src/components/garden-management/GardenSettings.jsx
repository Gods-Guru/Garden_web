import React, { useState } from 'react';
import useGardenStore from '../../store/useGardenStore';
import useNotificationStore from '../../store/useNotificationStore';

const GardenSettings = ({ garden }) => {
  const { updateGarden, loading } = useGardenStore();
  const { showSuccess, showError } = useNotificationStore();
  
  const [formData, setFormData] = useState({
    name: garden.name || '',
    description: garden.description || '',
    address: {
      street: garden.address?.street || '',
      city: garden.address?.city || '',
      state: garden.address?.state || '',
      zipCode: garden.address?.zipCode || '',
      country: garden.address?.country || 'USA'
    },
    contact: {
      email: garden.contact?.email || '',
      phone: garden.contact?.phone || ''
    },
    settings: {
      isPublic: garden.settings?.isPublic ?? true,
      requiresApproval: garden.settings?.requiresApproval ?? false,
      allowPhotos: garden.settings?.allowPhotos ?? true,
      allowEvents: garden.settings?.allowEvents ?? true
    },
    rules: garden.rules || '',
    numberOfPlots: garden.numberOfPlots || 0,
    area: garden.area || ''
  });

  const [activeSection, setActiveSection] = useState('basic');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await updateGarden(garden._id, formData);
    
    if (result.success) {
      showSuccess('Garden settings updated successfully!');
    } else {
      showError(result.error || 'Failed to update garden settings');
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: '📝' },
    { id: 'location', label: 'Location', icon: '📍' },
    { id: 'contact', label: 'Contact', icon: '📞' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'rules', label: 'Rules', icon: '📋' }
  ];

  return (
    <div className="garden-settings">
      <div className="settings-header">
        <h2>Garden Settings</h2>
        <p>Manage your garden's information and preferences</p>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          {sections.map(section => (
            <button
              key={section.id}
              className={`section-btn ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="section-icon">{section.icon}</span>
              <span className="section-label">{section.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          <form onSubmit={handleSubmit}>
            {activeSection === 'basic' && (
              <div className="settings-section">
                <h3>Basic Information</h3>
                
                <div className="form-group">
                  <label htmlFor="name">Garden Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your garden..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="numberOfPlots">Number of Plots</label>
                    <input
                      type="number"
                      id="numberOfPlots"
                      name="numberOfPlots"
                      value={formData.numberOfPlots}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="area">Total Area</label>
                    <input
                      type="text"
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="e.g., 2 acres, 5000 sq ft"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'location' && (
              <div className="settings-section">
                <h3>Location Information</h3>
                
                <div className="form-group">
                  <label htmlFor="address.street">Street Address</label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="address.city">City</label>
                    <input
                      type="text"
                      id="address.city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.state">State</label>
                    <input
                      type="text"
                      id="address.state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.zipCode">ZIP Code</label>
                    <input
                      type="text"
                      id="address.zipCode"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'contact' && (
              <div className="settings-section">
                <h3>Contact Information</h3>
                
                <div className="form-group">
                  <label htmlFor="contact.email">Contact Email</label>
                  <input
                    type="email"
                    id="contact.email"
                    name="contact.email"
                    value={formData.contact.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact.phone">Contact Phone</label>
                  <input
                    type="tel"
                    id="contact.phone"
                    name="contact.phone"
                    value={formData.contact.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="settings-section">
                <h3>Privacy & Permissions</h3>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="settings.isPublic"
                      checked={formData.settings.isPublic}
                      onChange={handleChange}
                    />
                    <span className="checkbox-text">
                      <strong>Public Garden</strong>
                      <small>Allow anyone to discover and request to join this garden</small>
                    </span>
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="settings.requiresApproval"
                      checked={formData.settings.requiresApproval}
                      onChange={handleChange}
                    />
                    <span className="checkbox-text">
                      <strong>Require Approval</strong>
                      <small>New members must be approved before joining</small>
                    </span>
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="settings.allowPhotos"
                      checked={formData.settings.allowPhotos}
                      onChange={handleChange}
                    />
                    <span className="checkbox-text">
                      <strong>Allow Photo Uploads</strong>
                      <small>Members can upload photos to the garden gallery</small>
                    </span>
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="settings.allowEvents"
                      checked={formData.settings.allowEvents}
                      onChange={handleChange}
                    />
                    <span className="checkbox-text">
                      <strong>Allow Events</strong>
                      <small>Members can create and manage garden events</small>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {activeSection === 'rules' && (
              <div className="settings-section">
                <h3>Garden Rules & Guidelines</h3>
                
                <div className="form-group">
                  <label htmlFor="rules">Rules and Guidelines</label>
                  <textarea
                    id="rules"
                    name="rules"
                    value={formData.rules}
                    onChange={handleChange}
                    rows={8}
                    placeholder="Enter garden rules, guidelines, and expectations for members..."
                  />
                </div>
              </div>
            )}

            <div className="settings-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GardenSettings;
