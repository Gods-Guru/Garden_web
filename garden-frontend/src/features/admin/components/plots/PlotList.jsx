import React from 'react';
import PropTypes from 'prop-types';
import useAuthStore from '../../../../store/useAuthStore';

const PlotList = ({ plots = [], onEdit, onAssign }) => {
  const { isGardenAdmin } = useAuthStore();

  if (!plots.length) return (
    <div className="no-plots">
      <p>No plots found. Start by creating a new plot.</p>
    </div>
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available':
        return 'badge-success';
      case 'occupied':
        return 'badge-warning';
      case 'maintenance':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="plot-list">
      {plots.map(plot => (
        <div key={plot._id} className="plot-card">
          <div className="plot-header">
            <h3>{plot.name}</h3>
            <span className={`status-badge ${getStatusBadgeClass(plot.status)}`}>
              {plot.status}
            </span>
          </div>
          
          <div className="plot-details">
            <p>
              <strong>Size:</strong> {plot.size} sq ft
            </p>
            <p>
              <strong>Location:</strong> {plot.location}
            </p>
            {plot.assignedTo && (
              <p>
                <strong>Assigned to:</strong> {plot.assignedTo.name}
              </p>
            )}
            {plot.description && (
              <p className="plot-description">{plot.description}</p>
            )}
          </div>

          <div className="plot-actions">
            {isGardenAdmin(plot.gardenId) && (
              <>
                <button 
                  className="btn-secondary btn-sm"
                  onClick={() => onEdit(plot)}
                >
                  Edit
                </button>
                {plot.status === 'available' && (
                  <button
                    className="btn-primary btn-sm"
                    onClick={() => onAssign(plot)}
                  >
                    Assign Plot
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

PlotList.propTypes = {
  plots: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    location: PropTypes.string,
    status: PropTypes.string,
    description: PropTypes.string,
    gardenId: PropTypes.string.isRequired,
    assignedTo: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
  })),
  onEdit: PropTypes.func.isRequired,
  onAssign: PropTypes.func.isRequired,
};

export default PlotList;
