import React, { useState, useRef } from 'react';
import './LocationPicker.scss';

const LocationPicker = ({
  onLocationSelect,
  initialLocation = null,
  required = false,
  error = null
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({
    lat: initialLocation?.lat || '',
    lng: initialLocation?.lng || ''
  });

  // Handle address input change
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  // Handle coordinate input change
  const handleCoordinateChange = (field, value) => {
    const newCoordinates = { ...coordinates, [field]: value };
    setCoordinates(newCoordinates);

    if (newCoordinates.lat && newCoordinates.lng) {
      const newLocation = {
        lat: parseFloat(newCoordinates.lat),
        lng: parseFloat(newCoordinates.lng),
        address: address || `${newCoordinates.lat}, ${newCoordinates.lng}`
      };
      setSelectedLocation(newLocation);

      if (onLocationSelect) {
        onLocationSelect(newLocation);
      }
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const newLocation = {
            lat,
            lng,
            address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          };

          setSelectedLocation(newLocation);
          setCoordinates({ lat: lat.toString(), lng: lng.toString() });

          if (onLocationSelect) {
            onLocationSelect(newLocation);
          }

          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting current location:', error);
          setIsLoading(false);
          alert('Unable to get your current location. Please enter coordinates manually.');
        }
      );
    } else {
      setIsLoading(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Validate and set location from address
  const handleSetLocation = () => {
    if (address && coordinates.lat && coordinates.lng) {
      const newLocation = {
        lat: parseFloat(coordinates.lat),
        lng: parseFloat(coordinates.lng),
        address: address
      };

      setSelectedLocation(newLocation);

      if (onLocationSelect) {
        onLocationSelect(newLocation);
      }
    }
  };

  return (
    <div className="location-picker">
      <div className="location-picker-header">
        <h3>Select Garden Location {required && <span className="required">*</span>}</h3>
        <p>Enter an address and coordinates, or use your current location</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="location-form">
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Enter garden address..."
            value={address}
            onChange={handleAddressChange}
            className="address-input"
          />
        </div>

        <div className="coordinates-group">
          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              type="number"
              id="latitude"
              placeholder="e.g., 40.7128"
              value={coordinates.lat}
              onChange={(e) => handleCoordinateChange('lat', e.target.value)}
              step="any"
              className="coordinate-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input
              type="number"
              id="longitude"
              placeholder="e.g., -74.0060"
              value={coordinates.lng}
              onChange={(e) => handleCoordinateChange('lng', e.target.value)}
              step="any"
              className="coordinate-input"
            />
          </div>
        </div>

        <div className="location-actions">
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="current-location-btn"
          >
            {isLoading ? 'Getting Location...' : '📍 Use Current Location'}
          </button>

          <button
            type="button"
            onClick={handleSetLocation}
            disabled={!address || !coordinates.lat || !coordinates.lng}
            className="set-location-btn"
          >
            Set Location
          </button>
        </div>
      </div>

      {selectedLocation && (
        <div className="selected-location">
          <h4>Selected Location:</h4>
          <p>{selectedLocation.address}</p>
          <div className="coordinates">
            <span>Latitude: {selectedLocation.lat.toFixed(6)}</span>
            <span>Longitude: {selectedLocation.lng.toFixed(6)}</span>
          </div>
        </div>
      )}

      {!selectedLocation && required && (
        <div className="location-required">
          <p>⚠️ Please select a location for your garden</p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
