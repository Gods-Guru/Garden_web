import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMapPin, FiPlus, FiFilter, FiSearch, FiGrid, FiList,
  FiDroplet, FiSun, FiCalendar, FiCamera, FiEdit3, FiEye
} from 'react-icons/fi';
import useAuthStore from '../store/useAuthStore';
import useNotificationStore from '../store/useNotificationStore';
import './Plots.scss';

const Plots = () => {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useNotificationStore();
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMyPlots();
  }, []);

  const fetchMyPlots = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockPlots = [
        {
          id: 1,
          number: 'A-12',
          garden: { id: 1, name: 'Sunny Acres Community Garden' },
          size: { width: 8, height: 10, area: 80 },
          status: 'assigned',
          assignedAt: new Date('2024-03-01'),
          location: { section: 'North Section', row: 'A', position: '12' },
          features: {
            hasWater: true,
            hasShed: false,
            hasCompost: true,
            soilType: 'loam',
            sunExposure: 'full-sun'
          },
          currentCrops: [
            { name: 'Tomatoes', variety: 'Cherry', plantedDate: new Date('2024-04-15'), status: 'growing' },
            { name: 'Lettuce', variety: 'Buttercrunch', plantedDate: new Date('2024-05-01'), status: 'ready' }
          ],
          lastWatered: new Date('2024-05-15'),
          nextMaintenance: new Date('2024-05-20'),
          images: [
            { url: '/api/placeholder/300/200', caption: 'Spring planting progress' }
          ],
          notes: 'Tomatoes are doing well, lettuce ready for harvest'
        },
        {
          id: 2,
          number: 'B-05',
          garden: { id: 1, name: 'Sunny Acres Community Garden' },
          size: { width: 6, height: 8, area: 48 },
          status: 'assigned',
          assignedAt: new Date('2024-04-01'),
          location: { section: 'South Section', row: 'B', position: '05' },
          features: {
            hasWater: false,
            hasShed: true,
            hasCompost: false,
            soilType: 'sandy',
            sunExposure: 'partial-sun'
          },
          currentCrops: [
            { name: 'Herbs', variety: 'Mixed', plantedDate: new Date('2024-04-20'), status: 'growing' }
          ],
          lastWatered: new Date('2024-05-14'),
          nextMaintenance: new Date('2024-05-22'),
          images: [],
          notes: 'Herb garden thriving'
        }
      ];

      setPlots(mockPlots);
    } catch (error) {
      console.error('Error fetching plots:', error);
      showError('Failed to load your plots');
    } finally {
      setLoading(false);
    }
  };

  const filteredPlots = plots.filter(plot => {
    const matchesStatus = filterStatus === 'all' || plot.status === filterStatus;
    const matchesSearch = plot.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plot.garden.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plot.currentCrops.some(crop => 
                           crop.name.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'green';
      case 'available': return 'blue';
      case 'maintenance': return 'orange';
      case 'reserved': return 'purple';
      default: return 'gray';
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysAssigned = (assignedDate) => {
    const days = Math.floor((new Date() - assignedDate) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="plots-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your plots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="plots-page">
      {/* Header */}
      <div className="plots-header">
        <div className="header-content">
          <div className="header-left">
            <h1>My Plots</h1>
            <p>Manage and track your garden plots</p>
          </div>
          <div className="header-actions">
            <Link to="/plots/apply" className="btn btn-primary">
              <FiPlus /> Apply for Plot
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="plots-stats">
          <div className="stat-item">
            <span className="stat-number">{plots.length}</span>
            <span className="stat-label">Active Plots</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {plots.reduce((sum, plot) => sum + plot.size.area, 0)} sq ft
            </span>
            <span className="stat-label">Total Area</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {plots.reduce((sum, plot) => sum + plot.currentCrops.length, 0)}
            </span>
            <span className="stat-label">Active Crops</span>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="plots-controls">
        <div className="controls-left">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search plots, gardens, crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-dropdown">
            <FiFilter className="filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="assigned">Assigned</option>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        </div>

        <div className="controls-right">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {/* Plots Grid/List */}
      <div className={`plots-container ${viewMode}`}>
        {filteredPlots.length === 0 ? (
          <div className="empty-state">
            <FiMapPin className="empty-icon" />
            <h3>No plots found</h3>
            <p>
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You don\'t have any plots yet. Apply for one to get started!'
              }
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Link to="/plots/apply" className="btn btn-primary">
                <FiPlus /> Apply for Plot
              </Link>
            )}
          </div>
        ) : (
          filteredPlots.map(plot => (
            <div key={plot.id} className="plot-card">
              {/* Plot Image */}
              <div className="plot-image">
                {plot.images.length > 0 ? (
                  <img src={plot.images[0].url} alt={`Plot ${plot.number}`} />
                ) : (
                  <div className="image-placeholder">
                    <FiMapPin />
                    <span>No photo</span>
                  </div>
                )}
                <div className="plot-overlay">
                  <Link to={`/plots/${plot.id}`} className="overlay-btn">
                    <FiEye /> View
                  </Link>
                  <Link to={`/plots/${plot.id}/edit`} className="overlay-btn">
                    <FiEdit3 /> Edit
                  </Link>
                </div>
              </div>

              {/* Plot Info */}
              <div className="plot-info">
                <div className="plot-header">
                  <h3>Plot {plot.number}</h3>
                  <span className={`status-badge ${getStatusColor(plot.status)}`}>
                    {plot.status}
                  </span>
                </div>

                <p className="garden-name">{plot.garden.name}</p>
                
                <div className="plot-details">
                  <div className="detail-item">
                    <span className="label">Size:</span>
                    <span className="value">{plot.size.width}' × {plot.size.height}' ({plot.size.area} sq ft)</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Location:</span>
                    <span className="value">{plot.location.section}, Row {plot.location.row}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Assigned:</span>
                    <span className="value">{getDaysAssigned(plot.assignedAt)} days ago</span>
                  </div>
                </div>

                {/* Features */}
                <div className="plot-features">
                  {plot.features.hasWater && (
                    <span className="feature-tag">
                      <FiDroplet /> Water Access
                    </span>
                  )}
                  {plot.features.hasCompost && (
                    <span className="feature-tag">
                      🌱 Compost
                    </span>
                  )}
                  <span className="feature-tag">
                    <FiSun /> {plot.features.sunExposure.replace('-', ' ')}
                  </span>
                </div>

                {/* Current Crops */}
                {plot.currentCrops.length > 0 && (
                  <div className="current-crops">
                    <h4>Current Crops:</h4>
                    <div className="crops-list">
                      {plot.currentCrops.map((crop, index) => (
                        <span key={index} className={`crop-tag ${crop.status}`}>
                          {crop.name} ({crop.variety})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Maintenance Info */}
                <div className="maintenance-info">
                  <div className="maintenance-item">
                    <FiDroplet className="maintenance-icon" />
                    <span>Last watered: {formatDate(plot.lastWatered)}</span>
                  </div>
                  <div className="maintenance-item">
                    <FiCalendar className="maintenance-icon" />
                    <span>Next maintenance: {formatDate(plot.nextMaintenance)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="plot-actions">
                  <Link to={`/plots/${plot.id}`} className="btn btn-outline btn-sm">
                    <FiEye /> View Details
                  </Link>
                  <Link to={`/plots/${plot.id}/photos`} className="btn btn-outline btn-sm">
                    <FiCamera /> Photos
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Plots;
