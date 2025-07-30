import React, { useState, useEffect } from 'react';
import './WeatherWidget.scss';

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temperature: 72,
    condition: 'Sunny',
    icon: '☀️',
    humidity: 45,
    windSpeed: 8
  });

  // Mock weather data - in production, this would fetch from a weather API
  useEffect(() => {
    // Simulate weather data
    const conditions = [
      { condition: 'Sunny', icon: '☀️', temp: 75 },
      { condition: 'Partly Cloudy', icon: '⛅', temp: 68 },
      { condition: 'Cloudy', icon: '☁️', temp: 65 },
      { condition: 'Rainy', icon: '🌧️', temp: 60 }
    ];
    
    const randomWeather = conditions[Math.floor(Math.random() * conditions.length)];
    setWeather({
      ...randomWeather,
      temperature: randomWeather.temp,
      humidity: Math.floor(Math.random() * 40) + 30,
      windSpeed: Math.floor(Math.random() * 15) + 5
    });
  }, []);

  return (
    <div className="weather-widget">
      <div className="weather-main">
        <span className="weather-icon">{weather.icon}</span>
        <div className="weather-info">
          <div className="temperature">{weather.temperature}°F</div>
          <div className="condition">{weather.condition}</div>
        </div>
      </div>
      <div className="weather-details">
        <span>💧 {weather.humidity}%</span>
        <span>💨 {weather.windSpeed} mph</span>
      </div>
    </div>
  );
};

export default WeatherWidget;
