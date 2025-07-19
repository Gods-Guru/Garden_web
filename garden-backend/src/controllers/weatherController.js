const axios = require('axios');

// Get weather for a garden location (requires garden with geo coordinates)
exports.getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ success: false, error: 'Latitude and longitude required' });
    // Example: OpenWeatherMap API (replace with your API key)
    const apiKey = process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    res.json({ success: true, weather: response.data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
