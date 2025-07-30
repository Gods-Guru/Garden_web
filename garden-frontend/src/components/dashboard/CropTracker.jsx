import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CropTracker.scss';

const CropTracker = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/crops/my-crops', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch crops');
      }

      const data = await response.json();
      setCrops(data.crops || []);
    } catch (error) {
      console.error('Error fetching crops:', error);
      setError(error.message);
      setCrops([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="crop-tracker loading">
        <div className="loading-spinner">Loading crops...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="crop-tracker error">
        <div className="error-state">
          <span className="error-icon">❌</span>
          <p>Error loading crops: {error}</p>
          <button onClick={fetchCrops} className="btn btn-outline">
            Try Again
          </button>
        </div>
      </div>
    );
  }
  if (!crops || crops.length === 0) {
    return (
      <div className="crop-tracker empty">
        <div className="empty-state">
          <span className="empty-icon">🌱</span>
          <p>No crops planted yet</p>
          <Link to="/my-plot/crops/add" className="btn btn-primary">
            Plant Crops
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      planted: '#6b7280',
      germinating: '#d97706',
      growing: '#059669',
      flowering: '#7c2d12',
      ready: '#dc2626',
      harvested: '#059669'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      planted: '🌰',
      germinating: '🌱',
      growing: '🌿',
      flowering: '🌸',
      ready: '🍅',
      harvested: '✅'
    };
    return icons[status] || '🌱';
  };

  const getCropIcon = (cropName) => {
    const icons = {
      tomatoes: '🍅',
      lettuce: '🥬',
      carrots: '🥕',
      basil: '🌿',
      peppers: '🌶️',
      cucumbers: '🥒',
      beans: '🫘',
      corn: '🌽',
      spinach: '🥬',
      herbs: '🌿'
    };
    return icons[cropName.toLowerCase()] || '🌱';
  };

  const isHarvestReady = (status) => {
    return status === 'ready';
  };

  return (
    <div className="crop-tracker">
      <div className="crops-grid">
        {crops.slice(0, 4).map((crop) => (
          <div 
            key={crop.id} 
            className={`crop-card ${isHarvestReady(crop.status) ? 'harvest-ready' : ''}`}
          >
            <div className="crop-header">
              <div className="crop-icon">
                {getCropIcon(crop.name)}
              </div>
              <div className="crop-info">
                <h4>{crop.name}</h4>
                <p className="crop-variety">{crop.variety}</p>
              </div>
              <div 
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(crop.status) }}
                title={crop.status}
              >
                {getStatusIcon(crop.status)}
              </div>
            </div>
            
            <div className="crop-details">
              <div className="detail-item">
                <span className="detail-label">Planted:</span>
                <span className="detail-value">{crop.planted}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span 
                  className="detail-value status"
                  style={{ color: getStatusColor(crop.status) }}
                >
                  {crop.status}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Harvest:</span>
                <span className={`detail-value ${isHarvestReady(crop.status) ? 'ready' : ''}`}>
                  {crop.harvestDate}
                </span>
              </div>
            </div>
            
            {isHarvestReady(crop.status) && (
              <div className="harvest-alert">
                <span className="alert-icon">🎉</span>
                <span className="alert-text">Ready to harvest!</span>
              </div>
            )}
            
            <div className="crop-actions">
              <Link 
                to={`/my-plot/crops/${crop.id}`}
                className="btn btn-outline btn-sm"
              >
                View Details
              </Link>
              {isHarvestReady(crop.status) && (
                <Link 
                  to={`/my-plot/crops/${crop.id}/harvest`}
                  className="btn btn-success btn-sm"
                >
                  Harvest
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {crops.length > 4 && (
        <div className="crops-summary">
          <p>Showing 4 of {crops.length} crops</p>
          <Link to="/my-plot/crops" className="view-all-crops">
            View all crops →
          </Link>
        </div>
      )}
    </div>
  );
};

export default CropTracker;
