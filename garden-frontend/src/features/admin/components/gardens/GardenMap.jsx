import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const GardenMap = ({ gardens, onGardenSelect }) => {
  // Default center coordinates (can be adjusted based on gardens' location)
  const center = [51.505, -0.09];
  
  return (
    <div className="garden-map">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '600px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {gardens?.map(garden => (
          <Marker
            key={garden._id}
            position={[garden.location.lat, garden.location.lng]}
            eventHandlers={{
              click: () => onGardenSelect(garden),
            }}
          >
            <Popup>
              <div className="garden-popup">
                <h3>{garden.name}</h3>
                <p>{garden.address}</p>
                <p>Plots: {garden.plots.length}</p>
                <button 
                  className="btn-link"
                  onClick={() => onGardenSelect(garden)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GardenMap;
