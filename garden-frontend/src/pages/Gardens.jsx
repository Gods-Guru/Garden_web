import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useGardenStore from '../store/useGardenStore';
import useNotificationStore from '../store/useNotificationStore';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import GardenCard from '../components/gardens/GardenCard';
import GardenMap from '../components/gardens/GardenMap';
import LocationService from '../services/LocationService';
import './Gardens.scss';

const Gardens = () => {
  const { isAuthenticated } = useAuthStore();
  const { gardens, loading, fetchGardens, fetchNearbyGardens } = useGardenStore();
  const { showError, showInfo } = useNotificationStore();
  
  const [view, setView] = useState('grid'); // 'grid' or 'map'
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    distance: 25, // miles
    type: 'all', // 'all', 'public', 'private'
    hasPlots: false
  });
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyGardens, setNearbyGardens] = useState([]);
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'name', 'members', 'created'
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Get user's location and fetch gardens
    initializeLocation();
    loadGardens();
  }, []);

  useEffect(() => {
    // Reload gardens when filters change
    loadGardens();
  }, [filters, userLocation]);

  const loadGardens = async () => {
    setLoading(true);
    try {
      // Always try to load real gardens from internet first
      const url = userLocation
        ? `/api/gardens/web?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${filters.distance}`
        : '/api/gardens/web?radius=50';

      const response = await fetch(url);

      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data.gardens) {
        // Successfully loaded gardens
        setGardens(result.data.gardens);

        if (result.data.gardens.length === 0) {
          showInfo('No gardens found in this area. Try increasing the search radius or try a different location.');
        } else {
          showInfo(`Found ${result.data.gardens.length} community gardens in your area!`);
        }
      } else {
        // API returned success: false
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

  useEffect(() => {
    // Filter and sort gardens when filters change
    filterAndSortGardens();
  }, [gardens, filters, sortBy, userLocation]);

  const initializeLocation = async () => {
    try {
      showInfo('Getting your location to find nearby gardens...');
      const location = await LocationService.getUserLocation();
      setUserLocation(location);
      
      // Update location filter with city/state
      if (location.city && location.state) {
        setFilters(prev => ({
          ...prev,
          location: `${location.city}, ${location.state}`
        }));
      }
    } catch (error) {
      console.error('Location error:', error);
      // Continue without location - user can still browse all gardens
    }
  };

  const filterAndSortGardens = () => {
    console.log('Filtering gardens:', gardens.length, 'gardens available');
    let filtered = [...gardens];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(garden =>
        garden.name?.toLowerCase().includes(searchLower) ||
        garden.description?.toLowerCase().includes(searchLower) ||
        garden.address?.city?.toLowerCase().includes(searchLower) ||
        garden.address?.state?.toLowerCase().includes(searchLower)
      );
      console.log('After search filter:', filtered.length);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(garden => {
        if (filters.type === 'public') return garden.settings?.isPublic !== false;
        if (filters.type === 'private') return garden.settings?.isPublic === false;
        return true;
      });
      console.log('After type filter:', filtered.length);
    }

    if (filters.hasPlots) {
      filtered = filtered.filter(garden => (garden.numberOfPlots || 0) > 0);
      console.log('After plots filter:', filtered.length);
    }

    // Calculate distances if we have user location
    if (userLocation) {
      filtered = filtered.map(garden => {
        // Handle different coordinate formats
        let gardenLat = 0, gardenLng = 0;

        if (garden.coordinates) {
          if (garden.coordinates.lat && garden.coordinates.lng) {
            gardenLat = garden.coordinates.lat;
            gardenLng = garden.coordinates.lng;
          } else if (garden.coordinates.coordinates && Array.isArray(garden.coordinates.coordinates)) {
            // GeoJSON format [lng, lat]
            gardenLng = garden.coordinates.coordinates[0];
            gardenLat = garden.coordinates.coordinates[1];
          }
        }

        const distance = (gardenLat && gardenLng) ?
          LocationService.calculateDistance(userLocation.lat, userLocation.lng, gardenLat, gardenLng) :
          999; // Large distance for gardens without coordinates

        return { ...garden, distance };
      });

      // Filter by distance only if not "any distance"
      if (filters.distance < 999) {
        filtered = filtered.filter(garden => garden.distance <= filters.distance);
        console.log('After distance filter:', filtered.length);
      }
    }

    // Sort gardens
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 999) - (b.distance || 999);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'members':
          return (b.stats?.activeMembers || 0) - (a.stats?.activeMembers || 0);
        case 'created':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    console.log('Final filtered gardens:', filtered.length);
    setNearbyGardens(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return <LoadingSpinner message="Loading community gardens..." />;
  }

  return (
    <div className="gardens-page">
      <Navbar />
      
      <div className="gardens-container">
        <header className="gardens-hero">
          <div className="hero-background">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="hero-text">
                <h1>Discover Community Gardens</h1>
                <p className="hero-subtitle">Connect with local gardening communities and find your perfect plot</p>
                {userLocation && (
                  <div className="location-badge">
                    <span className="location-icon">📍</span>
                    <span>Searching near {userLocation.city}, {userLocation.state}</span>
                  </div>
                )}
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">{nearbyGardens.length}</span>
                    <span className="stat-label">Gardens Found</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{nearbyGardens.filter(g => g.stats?.availablePlots > 0).length}</span>
                    <span className="stat-label">With Available Plots</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{nearbyGardens.reduce((sum, g) => sum + (g.stats?.activeMembers || 0), 0)}</span>
                    <span className="stat-label">Active Gardeners</span>
                  </div>
                </div>
              </div>

              <div className="hero-actions">
                {isAuthenticated && (
                  <Link to="/gardens/create" className="btn btn-primary btn-large">
                    <span className="btn-icon">🌱</span>
                    Register Your Garden
                  </Link>
                )}
                <button
                  className="btn btn-secondary btn-large"
                  onClick={() => {
                    const element = document.querySelector('.gardens-filters');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="btn-icon">🔍</span>
                  Explore Gardens
                </button>
              </div>
            </div>
          </div>
        </header>

        <nav className="gardens-nav">
          <div className="nav-content">
            <div className="nav-filters">
              <div className="quick-filters">
                <button
                  className={`quick-filter ${filters.type === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('type', 'all')}
                >
                  All Gardens
                </button>
                <button
                  className={`quick-filter ${filters.hasPlots ? 'active' : ''}`}
                  onClick={() => handleFilterChange('hasPlots', !filters.hasPlots)}
                >
                  Available Plots
                </button>
                <button
                  className={`quick-filter ${filters.distance <= 10 ? 'active' : ''}`}
                  onClick={() => handleFilterChange('distance', filters.distance <= 10 ? 999 : 10)}
                >
                  Nearby Only
                </button>
              </div>
            </div>

            <div className="view-controls">
              <div className="view-toggle">
                <button
                  className={`toggle-btn ${view === 'grid' ? 'active' : ''}`}
                  onClick={() => setView('grid')}
                  title="Grid View"
                >
                  <span className="toggle-icon">⊞</span>
                  <span className="toggle-label">Grid</span>
                </button>
                <button
                  className={`toggle-btn ${view === 'map' ? 'active' : ''}`}
                  onClick={() => setView('map')}
                  title="Map View"
                >
                  <span className="toggle-icon">🗺</span>
                  <span className="toggle-label">Map</span>
                </button>
              </div>

              <button
                className={`system-btn ${showDebug ? 'active' : ''}`}
                onClick={() => setShowDebug(!showDebug)}
                title="System Information"
              >
                ⚙️
              </button>
            </div>
          </div>
        </nav>

        <div className="gardens-filters">
          <div className="filters-header">
            <h3>Find Your Perfect Garden</h3>
            <p>Use the filters below to discover community gardens that match your needs</p>
          </div>

          <div className="filters-content">
            <div className="primary-filters">
              <div className="search-section">
                <div className="search-container">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by garden name, location, or features..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="search-input"
                  />
                  {filters.search && (
                    <button
                      className="clear-search"
                      onClick={() => handleFilterChange('search', '')}
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="secondary-filters">
              <div className="filter-group">
                <label className="filter-label">
                  <span className="label-icon">📏</span>
                  <span className="label-text">Distance</span>
                </label>
                <select
                  value={filters.distance}
                  onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
                  disabled={!userLocation}
                  className="filter-select"
                >
                  <option value={5}>Within 5 miles</option>
                  <option value={10}>Within 10 miles</option>
                  <option value={25}>Within 25 miles</option>
                  <option value={50}>Within 50 miles</option>
                  <option value={100}>Within 100 miles</option>
                  <option value={999}>Any distance</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <span className="label-icon">🏛️</span>
                  <span className="label-text">Access Type</span>
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Gardens</option>
                  <option value="public">Public Access</option>
                  <option value="private">Members Only</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <span className="label-icon">📊</span>
                  <span className="label-text">Sort By</span>
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="distance">Nearest First</option>
                  <option value="name">Alphabetical</option>
                  <option value="members">Most Active</option>
                  <option value="created">Recently Added</option>
                </select>
              </div>

              <div className="filter-group checkbox-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={filters.hasPlots}
                    onChange={(e) => handleFilterChange('hasPlots', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-label">
                    <span className="checkbox-icon">🌿</span>
                    <span className="checkbox-text">Available plots only</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="filters-summary">
              <div className="results-count">
                <strong>{nearbyGardens.length}</strong> gardens found
                {userLocation && nearbyGardens.length > 0 && (
                  <span className="distance-range">
                    • Within {Math.max(...nearbyGardens.map(g => g.distance || 0)).toFixed(0)} miles
                  </span>
                )}
              </div>

              {(filters.search || filters.hasPlots || filters.type !== 'all' || filters.distance < 999) && (
                <button
                  className="clear-filters"
                  onClick={() => {
                    setFilters({
                      search: '',
                      location: '',
                      distance: 25,
                      type: 'all',
                      hasPlots: false
                    });
                    setSortBy('distance');
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>

        {showDebug && (
          <div className="debug-panel" style={{
            background: '#1f2937',
            color: '#f9fafb',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem'
          }}>
            <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>System Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <strong>User Location:</strong>
                <pre>{JSON.stringify(userLocation, null, 2)}</pre>
              </div>
              <div>
                <strong>Filters:</strong>
                <pre>{JSON.stringify(filters, null, 2)}</pre>
              </div>
              <div>
                <strong>🌍 Raw Internet Gardens ({gardens.length}):</strong>
                {gardens.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Data Sources:</strong>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      {Object.entries(gardens.reduce((acc, garden) => {
                        const source = garden.source || 'Unknown';
                        acc[source] = (acc[source] || 0) + 1;
                        return acc;
                      }, {})).map(([source, count]) => (
                        <span key={source} style={{
                          display: 'inline-block',
                          background: '#f0f9ff',
                          color: '#0369a1',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          margin: '0.25rem 0.5rem 0.25rem 0',
                          fontSize: '0.75rem'
                        }}>
                          {source}: {count}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <pre style={{ fontSize: '0.75rem', maxHeight: '150px', overflow: 'auto' }}>
                  {JSON.stringify(gardens.slice(0, 2).map(g => ({
                    name: g.name,
                    source: g.source,
                    city: g.address?.city,
                    coordinates: g.coordinates
                  })), null, 2)}
                </pre>
              </div>
              <div>
                <strong>🎯 Filtered Gardens ({nearbyGardens.length}):</strong>
                <pre style={{ fontSize: '0.75rem', maxHeight: '150px', overflow: 'auto' }}>
                  {JSON.stringify(nearbyGardens.slice(0, 2).map(g => ({
                    name: g.name,
                    source: g.source,
                    distance: g.distance,
                    city: g.address?.city
                  })), null, 2)}
                </pre>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <strong>Data Status:</strong> {loading ? 'Loading garden data...' : 'Connected'}
              {gardens.length === 0 && !loading && (
                <span style={{ color: '#ef4444', marginLeft: '1rem' }}>
                  ⚠️ No garden data available
                </span>
              )}
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={async () => {
                    console.log('Checking data source...');
                    try {
                      const response = await fetch('/api/gardens/debug/count');
                      const data = await response.json();
                      console.log('Data source response:', data);
                      alert(`Found ${data.data?.totalGardens || 0} gardens in database`);
                    } catch (error) {
                      console.error('Data source error:', error);
                      alert('Unable to check data source: ' + error.message);
                    }
                  }}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '1rem'
                  }}
                >
                  Check Database
                </button>
                <button
                  onClick={() => {
                    console.log('Refreshing garden data...');
                    loadGardens();
                  }}
                  style={{
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '1rem'
                  }}
                >
                  Refresh Data
                </button>
                <button
                  onClick={async () => {
                    console.log('Testing data connection...');
                    try {
                      const response = await fetch('/api/gardens?limit=50');
                      console.log('Response status:', response.status);
                      console.log('Response headers:', response.headers);
                      const text = await response.text();
                      console.log('Raw response:', text);
                      try {
                        const data = JSON.parse(text);
                        console.log('Parsed data:', data);
                        alert(`Connection successful. Found ${data.data?.gardens?.length || 0} gardens.`);
                      } catch (e) {
                        alert(`Connection error: Invalid data format`);
                      }
                    } catch (error) {
                      console.error('Connection error:', error);
                      alert('Connection failed: ' + error.message);
                    }
                  }}
                  style={{
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '1rem'
                  }}
                >
                  Test Connection
                </button>
                <button
                  onClick={async () => {
                    console.log('🌍 Loading REAL gardens from internet...');
                    try {
                      const url = userLocation
                        ? `/api/gardens/web?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=50`
                        : '/api/gardens/web';
                      const response = await fetch(url);
                      const data = await response.json();
                      console.log('🌱 Real garden data response:', data);

                      if (data.success && data.data.gardens) {
                        const sources = data.data.sources || {};
                        const sourceList = Object.entries(sources)
                          .map(([source, count]) => `${source}: ${count}`)
                          .join('\n');

                        alert(`🌱 Found ${data.data.gardens.length} REAL community gardens!\n\nSources:\n${sourceList}\n\nData fetched from live internet sources including OpenStreetMap, location search, and community databases.`);

                        // Update the gardens directly
                        setNearbyGardens(data.data.gardens);
                      } else {
                        alert('No real garden data found. The system searched multiple internet sources but found no gardens in your area.');
                      }
                    } catch (error) {
                      console.error('❌ Real garden data error:', error);
                      alert('Unable to load real garden data: ' + error.message);
                    }
                  }}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  🌍 Load Real Gardens
                </button>

                <button
                  onClick={async () => {
                    console.log('🔍 Testing garden discovery worldwide...');
                    try {
                      const url = userLocation
                        ? `/api/gardens/discover?lat=${userLocation.lat}&lng=${userLocation.lng}`
                        : '/api/gardens/discover';
                      const response = await fetch(url);
                      const data = await response.json();
                      console.log('🌍 Garden discovery results:', data);

                      if (data.success) {
                        const results = data.data;
                        let message = '🌍 REAL Garden Discovery Test Results:\n\n';

                        Object.entries(results).forEach(([location, result]) => {
                          if (result.error) {
                            message += `❌ ${location}: ${result.error}\n`;
                          } else {
                            message += `✅ ${location}: ${result.count} gardens found\n`;
                            if (result.sources) {
                              const sources = Object.entries(result.sources)
                                .map(([source, count]) => `  • ${source}: ${count}`)
                                .join('\n');
                              message += `${sources}\n`;
                            }
                          }
                          message += '\n';
                        });

                        alert(message);
                      } else {
                        alert('Garden discovery test failed: ' + data.message);
                      }
                    } catch (error) {
                      console.error('❌ Garden discovery test error:', error);
                      alert('Discovery test failed: ' + error.message);
                    }
                  }}
                  style={{
                    background: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginLeft: '1rem'
                  }}
                >
                  🔍 Test Discovery
                </button>

                <button
                  onClick={async () => {
                    if (!userLocation) {
                      alert('❌ Location required for intensive search. Please enable location access.');
                      return;
                    }

                    console.log('🔍 Starting INTENSIVE garden search...');
                    try {
                      const response = await fetch(`/api/gardens/search-intensive?lat=${userLocation.lat}&lng=${userLocation.lng}`);
                      const data = await response.json();
                      console.log('🌍 Intensive search results:', data);

                      if (data.success) {
                        const totalGardens = data.data.totalUniqueGardens;
                        const searches = data.data.searchResults;
                        const sources = data.data.allSources;

                        let message = `🎉 INTENSIVE SEARCH RESULTS:\n\n`;
                        message += `📍 Location: ${userLocation.city}, ${userLocation.state}\n`;
                        message += `🌱 Total Unique Gardens Found: ${totalGardens}\n\n`;

                        message += `📊 Search Breakdown:\n`;
                        Object.entries(searches).forEach(([searchName, result]) => {
                          if (result.error) {
                            message += `❌ ${searchName}: ${result.error}\n`;
                          } else {
                            message += `✅ ${searchName}: ${result.found} gardens (${result.newUnique} unique)\n`;
                          }
                        });

                        message += `\n🌐 Data Sources:\n`;
                        Object.entries(sources).forEach(([source, count]) => {
                          message += `  • ${source}: ${count} gardens\n`;
                        });

                        if (data.data.sampleNames && data.data.sampleNames.length > 0) {
                          message += `\n🏷️ Sample Garden Names:\n`;
                          data.data.sampleNames.slice(0, 10).forEach(name => {
                            message += `  • ${name}\n`;
                          });
                        }

                        alert(message);

                        // Update the display with found gardens
                        if (data.data.gardens && data.data.gardens.length > 0) {
                          setNearbyGardens(data.data.gardens);
                        }
                      } else {
                        alert('❌ Intensive search failed: ' + data.message);
                      }
                    } catch (error) {
                      console.error('❌ Intensive search error:', error);
                      alert('❌ Intensive search failed: ' + error.message);
                    }
                  }}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginLeft: '1rem'
                  }}
                >
                  🔥 Intensive Search
                </button>
              </div>
            </div>
          </div>
        )}

        {nearbyGardens.length > 0 && (
          <div className="gardens-insights">
            <div className="insights-header">
              <h3>Community Impact</h3>
              <p>Discover the vibrant gardening community in your area</p>
            </div>

            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">🌱</div>
                <div className="insight-content">
                  <div className="insight-number">{nearbyGardens.length}</div>
                  <div className="insight-label">Active Gardens</div>
                  <div className="insight-description">Community gardens in your search area</div>
                </div>
              </div>

              <div className="insight-card">
                <div className="insight-icon">👥</div>
                <div className="insight-content">
                  <div className="insight-number">
                    {nearbyGardens.reduce((sum, g) => sum + (g.stats?.activeMembers || 0), 0)}
                  </div>
                  <div className="insight-label">Active Gardeners</div>
                  <div className="insight-description">People growing food and community</div>
                </div>
              </div>

              <div className="insight-card">
                <div className="insight-icon">🌿</div>
                <div className="insight-content">
                  <div className="insight-number">
                    {nearbyGardens.reduce((sum, g) => sum + (g.numberOfPlots || g.stats?.totalPlots || 0), 0)}
                  </div>
                  <div className="insight-label">Garden Plots</div>
                  <div className="insight-description">Individual growing spaces available</div>
                </div>
              </div>

              <div className="insight-card">
                <div className="insight-icon">✅</div>
                <div className="insight-content">
                  <div className="insight-number">
                    {nearbyGardens.reduce((sum, g) => sum + (g.stats?.availablePlots || 0), 0)}
                  </div>
                  <div className="insight-label">Available Now</div>
                  <div className="insight-description">Plots ready for new gardeners</div>
                </div>
              </div>

              <div className="insight-card">
                <div className="insight-icon">🏛️</div>
                <div className="insight-content">
                  <div className="insight-number">
                    {nearbyGardens.filter(g => g.settings?.isPublic !== false).length}
                  </div>
                  <div className="insight-label">Public Access</div>
                  <div className="insight-description">Gardens open to all community members</div>
                </div>
              </div>

              <div className="insight-card">
                <div className="insight-icon">📏</div>
                <div className="insight-content">
                  <div className="insight-number">
                    {userLocation && nearbyGardens.length > 0
                      ? Math.min(...nearbyGardens.map(g => g.distance || 999)).toFixed(1)
                      : '—'
                    }
                  </div>
                  <div className="insight-label">Nearest Garden</div>
                  <div className="insight-description">Miles from your location</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="gardens-content">
          {view === 'grid' ? (
            <div className="gardens-section">
              <div className="section-header">
                <h2>Community Gardens</h2>
                <div className="section-actions">
                  <button
                    className="view-options-btn"
                    onClick={() => {
                      // Toggle between different grid layouts
                      const grid = document.querySelector('.gardens-grid');
                      grid.classList.toggle('compact-view');
                    }}
                  >
                    ⊞ Layout
                  </button>
                </div>
              </div>

              {nearbyGardens.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-illustration">
                    <div className="empty-icon">🌱</div>
                    <div className="empty-plants">
                      <span>🌿</span>
                      <span>🌾</span>
                      <span>🌻</span>
                    </div>
                  </div>
                  <div className="empty-content">
                    <h3>No community gardens found</h3>
                    <p>We couldn't find any gardens matching your current filters. Try expanding your search or adjusting your criteria.</p>
                    <div className="empty-suggestions">
                      <h4>Suggestions:</h4>
                      <ul>
                        <li>Increase your search radius</li>
                        <li>Remove the "available plots" filter</li>
                        <li>Try searching for a different location</li>
                        <li>Browse all garden types</li>
                      </ul>
                    </div>
                    {isAuthenticated && (
                      <div className="empty-actions">
                        <Link to="/gardens/create" className="btn btn-primary">
                          <span className="btn-icon">🌱</span>
                          Register New Garden
                        </Link>
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setFilters({
                              search: '',
                              location: '',
                              distance: 999,
                              type: 'all',
                              hasPlots: false
                            });
                          }}
                        >
                          <span className="btn-icon">🔄</span>
                          Reset Filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="gardens-grid">
                  {nearbyGardens.map((garden, index) => (
                    <div key={garden._id || garden.id} className="garden-item">
                      <div className="garden-card-wrapper">
                        <GardenCard
                          garden={garden}
                          userRole={null}
                          showDistance={!!userLocation}
                        />

                        <div className="garden-overlay">
                          {garden.distance && (
                            <div className="distance-badge">
                              <span className="distance-icon">📍</span>
                              <span className="distance-text">{garden.distance.toFixed(1)} mi</span>
                            </div>
                          )}

                          {garden.stats?.availablePlots > 0 && (
                            <div className="availability-badge">
                              <span className="availability-icon">✅</span>
                              <span className="availability-text">{garden.stats.availablePlots} available</span>
                            </div>
                          )}

                          {garden.source && (
                            <div className="source-badge" title={`Data from ${garden.source}`}>
                              {garden.source === 'OpenStreetMap' && '🗺️'}
                              {garden.source === 'Google Places' && '📍'}
                              {garden.source === 'Demo Data' && '🌟'}
                              {garden.source === 'Generated Local' && '🏠'}
                            </div>
                          )}
                        </div>

                        <div className="garden-quick-actions">
                          <button
                            className="quick-action-btn"
                            onClick={() => {
                              if (garden.contact?.email) {
                                window.location.href = `mailto:${garden.contact.email}`;
                              } else {
                                alert(`Contact ${garden.name} for more information about joining this community garden.`);
                              }
                            }}
                            title="Contact Garden"
                          >
                            📧
                          </button>

                          <button
                            className="quick-action-btn"
                            onClick={() => {
                              if (garden.coordinates) {
                                const lat = garden.coordinates.coordinates ? garden.coordinates.coordinates[1] : garden.coordinates.lat;
                                const lng = garden.coordinates.coordinates ? garden.coordinates.coordinates[0] : garden.coordinates.lng;
                                window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                              }
                            }}
                            title="Get Directions"
                          >
                            🧭
                          </button>

                          <button
                            className="quick-action-btn"
                            onClick={() => {
                              // Share garden
                              if (navigator.share) {
                                navigator.share({
                                  title: garden.name,
                                  text: garden.description,
                                  url: window.location.href
                                });
                              } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Garden link copied to clipboard!');
                              }
                            }}
                            title="Share Garden"
                          >
                            📤
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="gardens-map">
              <GardenMap 
                gardens={nearbyGardens}
                userLocation={userLocation}
                onGardenSelect={(garden) => {
                  // Handle garden selection from map
                  console.log('Selected garden:', garden);
                }}
              />
            </div>
          )}
        </div>

        <div className="gardens-stats">
          <div className="stat">
            <span className="stat-number">{nearbyGardens.length}</span>
            <span className="stat-label">Gardens Found</span>
          </div>
          {userLocation && (
            <div className="stat">
              <span className="stat-number">
                {nearbyGardens.filter(g => g.distance <= 10).length}
              </span>
              <span className="stat-label">Within 10 miles</span>
            </div>
          )}
          <div className="stat">
            <span className="stat-number">
              {nearbyGardens.filter(g => g.settings?.isPublic !== false).length}
            </span>
            <span className="stat-label">Public Gardens</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gardens;
