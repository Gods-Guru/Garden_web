import React from 'react';
import { Link } from 'react-router-dom';
import './MyPlotsList.scss';

const MyPlotsList = ({ plots }) => {
  if (!plots || plots.length === 0) {
    return (
      <div className="my-plots-list empty">
        <div className="empty-state">
          <span className="empty-icon">🌿</span>
          <p>No plots assigned</p>
          <Link to="/plots/apply" className="btn btn-primary">
            Apply for Plot
          </Link>
        </div>
      </div>
    );
  }

  const getHealthColor = (score) => {
    if (score >= 90) return '#059669';
    if (score >= 70) return '#d97706';
    return '#dc2626';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#059669',
      inactive: '#6b7280',
      maintenance: '#d97706'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="my-plots-list">
      {plots.map((plot) => (
        <div key={plot.id} className="plot-card">
          <div className="plot-image">
            <img 
              src={plot.image || '/default-plot.jpg'} 
              alt={`Plot ${plot.plotNumber}`}
            />
            <div 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(plot.status) }}
            >
              {plot.status}
            </div>
          </div>
          
          <div className="plot-info">
            <div className="plot-header">
              <h4>Plot {plot.plotNumber}</h4>
              <div 
                className="health-score"
                style={{ color: getHealthColor(plot.healthScore) }}
              >
                💚 {plot.healthScore}%
              </div>
            </div>
            
            <div className="plot-details">
              <p className="plot-garden">🌱 {plot.garden}</p>
              <p className="plot-size">📏 {plot.size}</p>
              <p className="last-watered">💧 Watered {plot.lastWatered}</p>
            </div>
          </div>
          
          <div className="plot-actions">
            <Link 
              to={`/my-plot/${plot.id}`}
              className="btn btn-primary btn-sm"
            >
              Manage
            </Link>
            <Link 
              to={`/my-plot/${plot.id}/log`}
              className="btn btn-outline btn-sm"
            >
              Log Activity
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPlotsList;
