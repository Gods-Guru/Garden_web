import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useGardenStore from '../store/useGardenStore';
import useNotificationStore from '../store/useNotificationStore';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import GardenSettings from '../components/garden-management/GardenSettings';
import MemberManagement from '../components/garden-management/MemberManagement';
import PlotManagement from '../components/garden-management/PlotManagement';
import EventManagement from '../components/garden-management/EventManagement';
import MediaManagement from '../components/garden-management/MediaManagement';
import './GardenManagement.scss';

const GardenManagement = () => {
  const { gardenId } = useParams();
  const navigate = useNavigate();
  const { user, isGardenAdmin } = useAuthStore();
  const { currentGarden, fetchGarden, loading } = useGardenStore();
  const { showError } = useNotificationStore();
  
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!gardenId) {
      navigate('/gardens');
      return;
    }

    // Check if user has admin rights for this garden
    if (!isGardenAdmin(gardenId)) {
      showError('You do not have permission to manage this garden');
      navigate(`/gardens/${gardenId}`);
      return;
    }

    fetchGarden(gardenId);
  }, [gardenId, isGardenAdmin, fetchGarden, navigate, showError]);

  if (loading) {
    return <LoadingSpinner message="Loading garden management..." />;
  }

  if (!currentGarden) {
    return (
      <div className="garden-management">
        <Navbar />
        <div className="error-container">
          <h2>Garden not found</h2>
          <p>The garden you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'members', label: 'Members', icon: '👥' },
    { id: 'plots', label: 'Plots', icon: '🌿' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'media', label: 'Media', icon: '📸' }
  ];

  return (
    <div className="garden-management">
      <Navbar />
      
      <div className="management-container">
        <header className="management-header">
          <div className="header-content">
            <div className="garden-info">
              <h1>{currentGarden.name}</h1>
              <p>Garden Management Dashboard</p>
            </div>
            <div className="header-actions">
              <button 
                onClick={() => navigate(`/gardens/${gardenId}`)}
                className="btn btn-secondary"
              >
                View Garden
              </button>
            </div>
          </div>
        </header>

        <div className="management-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="management-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <h3>{currentGarden.stats?.activeMembers || 0}</h3>
                    <p>Active Members</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🌿</div>
                  <div className="stat-content">
                    <h3>{currentGarden.numberOfPlots || 0}</h3>
                    <p>Total Plots</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <h3>0</h3>
                    <p>Upcoming Events</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📸</div>
                  <div className="stat-content">
                    <h3>0</h3>
                    <p>Photos</p>
                  </div>
                </div>
              </div>

              <div className="overview-sections">
                <div className="section">
                  <h3>Recent Activity</h3>
                  <div className="activity-placeholder">
                    <p>No recent activity</p>
                  </div>
                </div>
                
                <div className="section">
                  <h3>Pending Actions</h3>
                  <div className="pending-actions">
                    <div className="action-item">
                      <span className="action-icon">👤</span>
                      <span className="action-text">0 membership requests</span>
                    </div>
                    <div className="action-item">
                      <span className="action-icon">📋</span>
                      <span className="action-text">0 pending tasks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <GardenSettings garden={currentGarden} />
          )}

          {activeTab === 'members' && (
            <MemberManagement gardenId={gardenId} />
          )}

          {activeTab === 'plots' && (
            <PlotManagement gardenId={gardenId} />
          )}

          {activeTab === 'events' && (
            <EventManagement gardenId={gardenId} />
          )}

          {activeTab === 'media' && (
            <MediaManagement gardenId={gardenId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GardenManagement;
