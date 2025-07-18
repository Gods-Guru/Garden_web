import React, { useState } from 'react';
import API from '../../api';
import './Weather.scss';

const Weather = () => {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWeather(null);
    try {
      const res = await API.get(`/weather?lat=${lat}&lon=${lon}`);
      setWeather(res.data.weather);
    } catch (err) {
      setError('Could not fetch weather.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather">
      <h2>Garden Weather</h2>
      <form onSubmit={handleFetch} className="weather-form">
        <input
          type="text"
          value={lat}
          onChange={e => setLat(e.target.value)}
          placeholder="Latitude"
          required
        />
        <input
          type="text"
          value={lon}
          onChange={e => setLon(e.target.value)}
          placeholder="Longitude"
          required
        />
        <button type="submit" disabled={loading}>Get Weather</button>
      </form>
      {loading && <div className="weather-loading">Loading...</div>}
      {error && <div className="weather-error">{error}</div>}
      {weather && (
        <div className="weather-result">
          <div><strong>Location:</strong> {weather.name}</div>
          <div><strong>Temperature:</strong> {weather.main.temp}°C</div>
          <div><strong>Weather:</strong> {weather.weather[0].description}</div>
          <div><strong>Humidity:</strong> {weather.main.humidity}%</div>
          <div><strong>Wind:</strong> {weather.wind.speed} m/s</div>
        </div>
      )}
    </div>
  );
};

export default Weather;
