import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import './GardenCard.scss';

const GardenCard = ({ garden, userRole, showManageButton = false, showDistance = false }) => {
  const { isGardenAdmin } = useAuthStore();
  const isAdmin = isGardenAdmin(garden._id);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'owner':
        return 'badge-owner';
      case 'admin':
        return 'badge-admin';
      case 'coordinator':
        return 'badge-coordinator';
      default:
        return 'badge-member';
    }
  };

  const formatAddress = (address) => {
    if (!address) return 'Location not specified';
    return `${address.city || ''}, ${address.state || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Location not specified';
  };

  return (
    <div className="garden-card">
      <div className="garden-card-header">
        {garden.images && garden.images.length > 0 ? (
          <img 
            src={garden.images[0]} 
            alt={garden.name}
            className="garden-image"
          />
        ) : (
          <div className="garden-image-placeholder">
            <span>🌱</span>
          </div>
        )}
        
        <div className="garden-card-overlay">
          <span className={`role-badge ${getRoleBadgeColor(userRole)}`}>
            {userRole}
          </span>
        </div>
      </div>

      <div className="garden-card-content">
        <h3 className="garden-name">{garden.name}</h3>
        
        <p className="garden-description">
          {garden.description || 'No description available'}
        </p>

        <div className="garden-details">
          <div className="detail-item">
            <span className="detail-icon">📍</span>
            <span className="detail-text">{formatAddress(garden.address)}</span>
          </div>
          
          {garden.stats && (
            <div className="detail-item">
              <span className="detail-icon">👥</span>
              <span className="detail-text">
                {garden.stats.activeMembers || 0} members
              </span>
            </div>
          )}

          {garden.numberOfPlots && (
            <div className="detail-item">
              <span className="detail-icon">🌿</span>
              <span className="detail-text">
                {garden.numberOfPlots} plots
              </span>
            </div>
          )}
        </div>

        <div className="garden-card-actions">
          <Link 
            to={`/gardens/${garden._id}`} 
            className="btn btn-primary"
          >
            View Garden
          </Link>
          
          {(showManageButton && isAdmin) && (
            <Link 
              to={`/gardens/${garden._id}/manage`} 
              className="btn btn-secondary"
            >
              Manage
            </Link>
          )}
        </div>
      </div>

      {garden.status && garden.status !== 'active' && (
        <div className="garden-status-indicator">
          <span className={`status-badge status-${garden.status}`}>
            {garden.status}
          </span>
        </div>
      )}
    </div>
  );
};

export default GardenCard;
