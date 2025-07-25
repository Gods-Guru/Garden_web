import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './UserSettings.scss';

function UserSettings() {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      events: true,
      messages: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showGardens: true
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    security: {
      twoFactorEnabled: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/users/settings', {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSettings(data.settings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/users/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(settings)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setSuccess('Settings updated successfully!');
      updateUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const setupTwoFactor = async () => {
    try {
      const res = await fetch('/api/users/2fa/setup', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      // Show QR code setup modal
      // Implementation depends on your 2FA solution
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  return (
    <div className="user-settings">
      <h2>User Settings</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <section className="settings-section">
          <h3>Notifications</h3>
          <div className="settings-group">
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
              />
              Email Notifications
            </label>
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => handleChange('notifications', 'push', e.target.checked)}
              />
              Push Notifications
            </label>
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.events}
                onChange={(e) => handleChange('notifications', 'events', e.target.checked)}
              />
              Event Reminders
            </label>
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.messages}
                onChange={(e) => handleChange('notifications', 'messages', e.target.checked)}
              />
              Message Notifications
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h3>Privacy</h3>
          <div className="settings-group">
            <div className="setting-item">
              <label>Profile Visibility</label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => handleChange('privacy', 'profileVisibility', e.target.value)}
              >
                <option value="public">Public</option>
                <option value="gardens">Garden Members Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            <label>
              <input
                type="checkbox"
                checked={settings.privacy.showEmail}
                onChange={(e) => handleChange('privacy', 'showEmail', e.target.checked)}
              />
              Show Email to Other Users
            </label>
            <label>
              <input
                type="checkbox"
                checked={settings.privacy.showGardens}
                onChange={(e) => handleChange('privacy', 'showGardens', e.target.checked)}
              />
              Show Garden Memberships
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h3>Preferences</h3>
          <div className="settings-group">
            <div className="setting-item">
              <label>Theme</label>
              <select
                value={settings.preferences.theme}
                onChange={(e) => handleChange('preferences', 'theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Language</label>
              <select
                value={settings.preferences.language}
                onChange={(e) => handleChange('preferences', 'language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Timezone</label>
              <select
                value={settings.preferences.timezone}
                onChange={(e) => handleChange('preferences', 'timezone', e.target.value)}
              >
                {Intl.supportedValuesOf('timeZone').map(timezone => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h3>Security</h3>
          <div className="settings-group">
            <div className="setting-item">
              <label>Two-Factor Authentication</label>
              {settings.security.twoFactorEnabled ? (
                <button 
                  type="button"
                  className="disable-2fa"
                  onClick={() => handleChange('security', 'twoFactorEnabled', false)}
                >
                  Disable 2FA
                </button>
              ) : (
                <button 
                  type="button"
                  className="enable-2fa"
                  onClick={setupTwoFactor}
                >
                  Enable 2FA
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="save-button">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserSettings;
