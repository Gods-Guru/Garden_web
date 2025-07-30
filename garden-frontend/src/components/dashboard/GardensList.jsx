import React from 'react';
import { Link } from 'react-router-dom';
import './GardensList.scss';

const GardensList = ({ gardens, showManagementActions = false }) => {
  if (!gardens || gardens.length === 0) {
    return (
      <div className="gardens-list empty">
        <div className="empty-state">
          <span className="empty-icon">🌱</span>
          <p>No gardens found</p>
          <Link to="/gardens" className="btn btn-primary">
            Browse Gardens
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="gardens-list">
      {gardens.slice(0, 3).map((garden, index) => (
        <div key={garden.id || garden._id || index} className="garden-item">
          <div className="garden-image">
            <img 
              src={garden.images?.[0] || garden.garden?.images?.[0] || '/default-garden.jpg'} 
              alt={garden.name || garden.garden?.name}
            />
          </div>
          <div className="garden-info">
            <h4>{garden.name || garden.garden?.name}</h4>
            <p className="garden-location">
              📍 {garden.address || garden.garden?.address}
            </p>
            <div className="garden-stats">
              <span>👥 {garden.memberCount || 0} members</span>
              <span>🌿 {garden.plotCount || 0} plots</span>
            </div>
          </div>
          <div className="garden-actions">
            {showManagementActions ? (
              <Link 
                to={`/gardens/${garden.id || garden._id}/manage`}
                className="btn btn-primary btn-sm"
              >
                Manage
              </Link>
            ) : (
              <Link 
                to={`/gardens/${garden.id || garden._id}`}
                className="btn btn-outline btn-sm"
              >
                View
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GardensList;
