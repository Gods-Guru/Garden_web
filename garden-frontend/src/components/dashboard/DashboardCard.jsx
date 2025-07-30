import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardCard.scss';

const DashboardCard = ({ title, value, icon, color, change, link, onClick }) => {
  const CardContent = () => (
    <div className="dashboard-card" style={{ borderLeftColor: color }}>
      <div className="card-header">
        <div className="card-icon" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className="card-title">
          <h3>{title}</h3>
          <div className="card-value">{value}</div>
        </div>
      </div>
      
      {change && (
        <div className="card-change">
          <span className="change-text">{change}</span>
        </div>
      )}
      
      <div className="card-footer">
        <span className="view-more">
          View Details →
        </span>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <div className="dashboard-card-wrapper" onClick={onClick}>
        <CardContent />
      </div>
    );
  }

  if (link) {
    return (
      <Link to={link} className="dashboard-card-wrapper">
        <CardContent />
      </Link>
    );
  }

  return (
    <div className="dashboard-card-wrapper">
      <CardContent />
    </div>
  );
};

export default DashboardCard;
