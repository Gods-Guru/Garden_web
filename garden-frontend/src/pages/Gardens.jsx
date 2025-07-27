import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useNotificationStore from '../store/useNotificationStore';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import GardenCard from '../components/gardens/GardenCard';
import GardenMap from '../components/gardens/GardenMap';
import LocationService from '../services/LocationService';
import '../styles/pagestyles/Gardens.scss';

const Gardens = () => {
  const { isAuthenticated } = useAuthStore();
  const { showError, showSuccess, showInfo } = useNotificationStore();
  
  const [view, setView] = useState('grid'); // 'grid' or 'map'
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    distance: 25, // miles
    type: 'all', // 'all', 'public', 'private'
    hasPlots: false
  });
  const [userLocation, setUserLocation] = useState(null);
  const [gardens, setGardens] = useState([]);
  const [filteredGardens, setFilteredGardens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'name', 'members', 'created'

  useEffect(() => {
    // Get user's location and fetch gardens
    initializeLocation();
    loadGardens();
  }, []);

  useEffect(() => {
    // Filter and sort gardens when data or filters change
    filterAndSortGardens();
  }, [gardens, filters, sortBy, userLocation]);

  const loadGardens = async () => {
    setLoading(true);
    try {
      showInfo('🌍 Searching for community gardens from real internet sources...');
      
      // Always try to load real gardens from internet first
      const url = userLocation
        ? `/api/gardens/web?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${filters.distance}`
        : '/api/gardens/web?radius=50';

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data.gardens) {
        setGardens(result.data.gardens);

        if (result.data.gardens.length === 0) {
          showInfo('No gardens found in this area. Try increasing the search radius or searching a different location.');
        } else {
          showSuccess(`🌱 Found ${result.data.gardens.length} real community gardens! Data sourced from OpenStreetMap, Google Places, and community databases.`);
        }
      } else {
        showError(result.message || 'Failed to load gardens. Please try again later.');
        setGardens([]);
      }
    } catch (error) {
      console.error('Error loading gardens:', error);
      showError('Unable to load gardens. Please check your connection and try again.');
      setGardens([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortGardens = () => {
    let filtered = [...gardens];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(garden =>
        garden.name?.toLowerCase().includes(searchTerm) ||
        garden.description?.toLowerCase().includes(searchTerm) ||
        garden.address?.city?.toLowerCase().includes(searchTerm) ||
        garden.address?.state?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(garden => garden.type === filters.type);
    }

    // Apply plots filter
    if (filters.hasPlots) {
      filtered = filtered.filter(garden => garden.availablePlots > 0);
    }

    // Apply distance filter
    if (userLocation && filters.distance < 999) {
      filtered = filtered.filter(garden => {
        const distance = garden.distance || calculateDistance(userLocation, garden.coordinates);
        return distance <= filters.distance;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'members':
          return (b.memberCount || 0) - (a.memberCount || 0);
        case 'created':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredGardens(filtered);
  };

  const calculateDistance = (location1, location2) => {
    if (!location1 || !location2) return 0;
    
    const lat1 = location1.lat || location1.latitude;
    const lng1 = location1.lng || location1.longitude;
    const lat2 = location2.coordinates?.[1] || location2.lat || location2.latitude;
    const lng2 = location2.coordinates?.[0] || location2.lng || location2.longitude;

    if (!lat1 || !lng1 || !lat2 || !lng2) return 0;

    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const initializeLocation = async () => {
    try {
      showInfo('📍 Getting your location to find nearby gardens...');
      const location = await LocationService.getUserLocation();
      setUserLocation(location);
      
      // Update location filter with city/state
      if (location.city && location.state) {
        setFilters(prev => ({
          ...prev,
          location: `${location.city}, ${location.state}`
        }));
      }
      
      showSuccess(`📍 Location found: ${location.city}, ${location.state}`);
    } catch (error) {
      console.error('Location error:', error);
      showError('Unable to get your location. You can still search for gardens manually.');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    loadGardens();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: userLocation ? `${userLocation.city}, ${userLocation.state}` : '',
      distance: 25,
      type: 'all',
      hasPlots: false
    });
    setSortBy('distance');
  };

  const getGardenImage = (garden) => {
    const gardenImages = [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    ];
    
    const hash = garden.name?.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0) || 0;
    
    return gardenImages[Math.abs(hash) % gardenImages.length];
  };

  if (loading) {
    return (
      <div className="gardens-page">
        <Navbar />
        <div className="loading-state">
          <LoadingSpinner />
          <div className="loading-text">🌍 Searching for real community gardens from internet sources...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="gardens-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="gardens-hero">
        <div className="container">
          <div className="hero-content">
            <h1>🌱 Discover Community Gardens</h1>
            <p className="hero-subtitle">
              Connect with local gardening communities and find your perfect plot. 
              All data sourced from real internet databases including OpenStreetMap and community directories.
            </p>
            {userLocation && (
              <div className="location-info">
                📍 Searching near {userLocation.city}, {userLocation.state}
              </div>
            )}
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{filteredGardens.length}</span>
                <span className="stat-label">Gardens Found</span>
              </div>
              <div className="stat">
                <span className="stat-number">{filteredGardens.filter(g => (g.numberOfPlots || 0) > 0).length}</span>
                <span className="stat-label">With Plots</span>
              </div>
              <div className="stat">
                <span className="stat-number">{gardens.length}</span>
                <span className="stat-label">Total Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="search-filters">
        <div className="container">
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search gardens by name, description, or location..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
            <input
              type="text"
              placeholder="Enter city, state, or zip code..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="location-input"
            />
            <button onClick={handleSearch} className="search-btn">
              🔍 Search
            </button>
          </div>

          {/* Filters Row */}
          <div className="filters-row">
            <div className="filter-group">
              <label>Distance</label>
              <select
                value={filters.distance}
                onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
              >
                <option value={5}>Within 5 miles</option>
                <option value={10}>Within 10 miles</option>
                <option value={25}>Within 25 miles</option>
                <option value={50}>Within 50 miles</option>
                <option value={999}>Any distance</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Garden Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Gardens</option>
                <option value="public">Public Gardens</option>
                <option value="private">Private Gardens</option>
              </select>
            </div>

            <div className="filter-group">
              <label>
                <input
                  type="checkbox"
                  checked={filters.hasPlots}
                  onChange={(e) => handleFilterChange('hasPlots', e.target.checked)}
                />
                Available plots only
              </label>
            </div>
          </div>

          {/* View Controls */}
          <div className="view-controls">
            <div className="view-toggle">
              <button
                className={view === 'grid' ? 'active' : ''}
                onClick={() => setView('grid')}
              >
                📋 Grid View
              </button>
              <button
                className={view === 'map' ? 'active' : ''}
                onClick={() => setView('map')}
              >
                🗺️ Map View
              </button>
            </div>

            <div className="sort-controls">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="distance">Distance</option>
                <option value="name">Name</option>
                <option value="members">Members</option>
                <option value="created">Recently Added</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <div className="results-count">
              <span className="count-number">{filteredGardens.length}</span> gardens found
              {userLocation && filteredGardens.length > 0 && (
                <span> • Within {Math.max(...filteredGardens.map(g => g.distance || 0)).toFixed(1)} miles</span>
              )}
            </div>
            {(filters.search || filters.hasPlots || filters.type !== 'all' || filters.distance < 999) && (
              <button onClick={clearFilters} className="clear-filters">
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Gardens Content */}
      <section className="gardens-content">
        <div className="container">
          {view === 'grid' ? (
            filteredGardens.length > 0 ? (
              <div className="gardens-grid">
                {filteredGardens.map((garden, index) => (
                  <div key={garden._id || index} className="garden-card">
                    <div className="garden-image">
                      <img
                        src={getGardenImage(garden)}
                        alt={garden.name}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop';
                        }}
                      />
                      {garden.settings?.isPublic !== false && (
                        <div className="garden-badge">Public</div>
                      )}
                      {garden.distance && (
                        <div className="distance-badge">
                          {garden.distance.toFixed(1)} miles away
                        </div>
                      )}
                    </div>

                    <div className="garden-content">
                      <h3 className="garden-title">{garden.name || 'Community Garden'}</h3>

                      <div className="garden-address">
                        <span className="location-icon">📍</span>
                        {garden.address ? (
                          `${garden.address.city || ''}, ${garden.address.state || ''}`
                        ) : (
                          garden.location?.city ? `${garden.location.city}, ${garden.location.state}` : 'Location not specified'
                        )}
                      </div>

                      {garden.description && (
                        <p className="garden-description">
                          {garden.description.length > 150
                            ? `${garden.description.substring(0, 150)}...`
                            : garden.description
                          }
                        </p>
                      )}

                      <div className="garden-features">
                        {garden.numberOfPlots > 0 && (
                          <span className="feature-tag">🌱 {garden.numberOfPlots} plots</span>
                        )}
                        {garden.stats?.activeMembers > 0 && (
                          <span className="feature-tag">👥 {garden.stats.activeMembers} members</span>
                        )}
                        {garden.source && (
                          <span className="feature-tag">📊 {garden.source}</span>
                        )}
                      </div>

                      <div className="garden-actions">
                        <Link
                          to={`/gardens/${garden._id || garden.id}`}
                          className="btn btn-primary"
                        >
                          View Details
                        </Link>
                        {isAuthenticated && (
                          <button className="btn btn-secondary">
                            Join Garden
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🌱</div>
                <h3 className="empty-title">No gardens found</h3>
                <p className="empty-description">
                  {filters.search || filters.hasPlots || filters.type !== 'all' || filters.distance < 999
                    ? 'Try adjusting your search filters to find more gardens.'
                    : 'No community gardens found in your area. Try expanding your search radius or searching a different location.'
                  }
                </p>
                <div className="empty-actions">
                  {(filters.search || filters.hasPlots || filters.type !== 'all' || filters.distance < 999) && (
                    <button onClick={clearFilters} className="btn btn-primary">
                      Clear Filters
                    </button>
                  )}
                  {isAuthenticated && (
                    <Link to="/gardens/create" className="btn btn-primary">
                      Create New Garden
                    </Link>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="map-view">
              <GardenMap gardens={filteredGardens} userLocation={userLocation} />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gardens;
