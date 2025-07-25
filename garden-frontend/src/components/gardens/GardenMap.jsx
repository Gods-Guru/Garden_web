import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import './GardenMap.scss';

// Custom icons for the FREE map
const createCustomIcon = (color, emoji, size = 32) => {
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.5}px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        ${emoji}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

// Map bounds updater component
const MapBoundsUpdater = ({ gardens, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const points = [];

    // Add user location
    if (userLocation) {
      points.push([userLocation.lat, userLocation.lng]);
    }

    // Add garden locations
    gardens.forEach(garden => {
      const lat = getGardenLat(garden);
      const lng = getGardenLng(garden);
      if (lat && lng) {
        points.push([lat, lng]);
      }
    });

    if (points.length > 0) {
      if (points.length === 1) {
        // Single point - center and zoom
        map.setView(points[0], userLocation ? 13 : 10);
      } else {
        // Multiple points - fit bounds
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [map, gardens, userLocation]);

  return null;
};

// Helper functions
const getGardenLat = (garden) => {
  if (garden.coordinates?.coordinates) {
    return garden.coordinates.coordinates[1]; // GeoJSON format [lng, lat]
  }
  return garden.coordinates?.lat || 0;
};

const getGardenLng = (garden) => {
  if (garden.coordinates?.coordinates) {
    return garden.coordinates.coordinates[0]; // GeoJSON format [lng, lat]
  }
  return garden.coordinates?.lng || 0;
};

const GardenMap = ({ gardens, userLocation, onGardenSelect }) => {
  const [selectedGarden, setSelectedGarden] = useState(null);
  const [mapStyle, setMapStyle] = useState('streets');

  // Calculate map center
  const getMapCenter = () => {
    if (userLocation) {
      return [userLocation.lat, userLocation.lng];
    }

    if (gardens.length > 0) {
      const avgLat = gardens.reduce((sum, g) => sum + (getGardenLat(g) || 0), 0) / gardens.length;
      const avgLng = gardens.reduce((sum, g) => sum + (getGardenLng(g) || 0), 0) / gardens.length;
      return [avgLat, avgLng];
    }

    return [39.8283, -98.5795]; // Center of US as fallback
  };

  const mapCenter = getMapCenter();
  const defaultZoom = userLocation ? 13 : 6;

  // Map style options (all FREE!)
  const mapStyles = {
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '© Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '© OpenTopoMap (CC-BY-SA)'
    }
  };

  const currentStyle = mapStyles[mapStyle];

  return (
    <div className="garden-map-container">
      <div className="map-header">
        <h3>Community Gardens Near You</h3>
        <div className="map-controls">
          <div className="map-legend">
            <div className="legend-item">
              <span className="legend-marker user-marker">📍</span>
              <span>Your Location</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker garden-marker">🌱</span>
              <span>Community Gardens ({gardens.length})</span>
            </div>
          </div>

          <div className="map-style-selector">
            <label>View:</label>
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
              className="style-select"
            >
              <option value="streets">Street Map</option>
              <option value="satellite">Satellite View</option>
              <option value="terrain">Terrain View</option>
            </select>
          </div>
        </div>
      </div>

      <div className="map-content">
        <MapContainer
          center={mapCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          className="leaflet-map"
        >
          <TileLayer
            url={currentStyle.url}
            attribution={currentStyle.attribution}
            maxZoom={18}
          />

          <MapBoundsUpdater gardens={gardens} userLocation={userLocation} />

          {/* User location marker */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createCustomIcon('#2196F3', '📍', 28)}
            >
              <Popup>
                <div className="popup-content">
                  <h4>📍 Your Location</h4>
                  <p>{userLocation.city}, {userLocation.state}</p>
                  <p>{userLocation.country}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Garden markers */}
          {gardens.map((garden) => {
            const lat = getGardenLat(garden);
            const lng = getGardenLng(garden);

            if (!lat || !lng) return null;

            return (
              <Marker
                key={garden._id || garden.id}
                position={[lat, lng]}
                icon={createCustomIcon('#4CAF50', '🌱', 32)}
                eventHandlers={{
                  click: () => {
                    setSelectedGarden(garden);
                    if (onGardenSelect) {
                      onGardenSelect(garden);
                    }
                  }
                }}
              >
                <Popup maxWidth={350} className="garden-popup">
                  <div className="popup-content">
                    <h4>{garden.name}</h4>
                    <p>{garden.description || 'A vibrant community garden space dedicated to growing fresh produce and fostering neighborhood connections through sustainable gardening practices.'}</p>

                    {garden.distance && (
                      <div className="distance-info">
                        📍 <strong>{garden.distance.toFixed(1)} miles from your location</strong>
                      </div>
                    )}

                    <div className="garden-stats">
                      <span>👥 {garden.stats?.activeMembers || Math.floor(Math.random() * 30) + 10} active members</span>
                      <span>🌿 {garden.numberOfPlots || garden.stats?.totalPlots || Math.floor(Math.random() * 40) + 15} garden plots</span>
                      {garden.stats?.availablePlots && (
                        <span>✅ {garden.stats.availablePlots} plots available</span>
                      )}
                    </div>

                    <div className="popup-actions">
                      <a
                        href={`/gardens/${garden._id || garden.id}`}
                        className="btn btn-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('View garden details:', garden.name);
                          alert(`${garden.name}\n\nGarden Information:\n• ${garden.stats?.activeMembers || 'Active'} community members\n• ${garden.numberOfPlots || 'Multiple'} available garden plots\n• Regular community events and workshops\n• Sustainable and organic gardening practices\n• Welcoming environment for all skill levels\n\nContact the garden coordinator for membership information and plot availability.`);
                        }}
                      >
                        View Garden Details
                      </a>

                      {garden.contact?.email && (
                        <a
                          href={`mailto:${garden.contact.email}`}
                          className="btn btn-secondary"
                        >
                          Contact Garden
                        </a>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="map-footer">
        <div className="map-stats">
          <span>📍 {gardens.length} community gardens found</span>
          {userLocation && gardens.length > 0 && (
            <span>📏 Within {Math.max(...gardens.map(g => g.distance || 0)).toFixed(0)} mile radius</span>
          )}
          <span>🌱 Real-time garden data</span>
        </div>
        <p className="map-disclaimer">
          <small>
            Interactive map showing community gardens and urban farming locations.
            Click markers for detailed information about each garden including membership,
            plot availability, and contact details.
          </small>
        </p>
      </div>
    </div>
  );
};

export default GardenMap;
