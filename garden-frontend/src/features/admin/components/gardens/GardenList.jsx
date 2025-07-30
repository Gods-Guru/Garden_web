import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const GardenList = ({ gardens = [], onEdit, onDelete, isLoading, error }) => {
  if (isLoading) return <div className="loading">Loading gardens...</div>;
  if (error) return <div className="error">Error loading gardens: {error}</div>;
  if (!gardens.length) return <div className="no-data">No gardens found. Create your first garden!</div>;

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-badge-success';
      case 'inactive':
        return 'status-badge-warning';
      case 'maintenance':
        return 'status-badge-danger';
      default:
        return 'status-badge-default';
    }
  };

  return (
    <div className="garden-list">
      {gardens.map(garden => (
        <div key={garden._id} className="garden-card">
          <div className="garden-header">
            <h3>{garden.name}</h3>
            <span className={`status-badge ${getStatusBadgeClass(garden.status)}`}>
              {garden.status}
            </span>
          </div>

          <div className="garden-content">
            <div className="garden-info">
              <p>{garden.description}</p>
              <div className="garden-details">
                <div className="detail-item">
                  <span className="label">📍 Location:</span>
                  <span>{garden.location.city}, {garden.location.state}</span>
                </div>
                <div className="detail-item">
                  <span className="label">📏 Size:</span>
                  <span>{garden.size} sq ft</span>
                </div>
                <div className="detail-item">
                  <span className="label">🏡 Plots:</span>
                  <span>{garden.plotCount} plots</span>
                </div>
              </div>
            </div>

            {garden.amenities?.length > 0 && (
              <div className="amenities">
                <h4>Amenities</h4>
                <div className="amenities-list">
                  {garden.amenities.map(amenity => (
                    <span key={amenity} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="garden-actions">
            <Link 
              to={`/gardens/${garden._id}/manage`} 
              className="btn-secondary btn-sm"
            >
              Manage Plots
            </Link>
            <button 
              className="btn-secondary btn-sm"
              onClick={() => onEdit(garden)}
            >
              Edit Garden
            </button>
            <button 
              className="btn-danger btn-sm"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this garden? This action cannot be undone.')) {
                  onDelete(garden._id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

GardenList.propTypes = {
  gardens: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      status: PropTypes.string.isRequired,
      location: PropTypes.shape({
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
      }).isRequired,
      size: PropTypes.number.isRequired,
      plotCount: PropTypes.number.isRequired,
      amenities: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};

export default GardenList;
