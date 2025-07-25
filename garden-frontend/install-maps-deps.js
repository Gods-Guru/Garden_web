// Script to install Google Maps dependencies
const { execSync } = require('child_process');

console.log('Installing Google Maps dependencies...');

try {
  // Install Google Maps React library
  console.log('Installing @googlemaps/react-wrapper...');
  execSync('npm install @googlemaps/react-wrapper', { stdio: 'inherit' });
  
  // Install Google Maps JavaScript API loader
  console.log('Installing @googlemaps/js-api-loader...');
  execSync('npm install @googlemaps/js-api-loader', { stdio: 'inherit' });
  
  console.log('✅ Google Maps dependencies installed successfully!');
  console.log('Next steps:');
  console.log('1. Get a Google Maps API key from: https://console.cloud.google.com/');
  console.log('2. Enable Maps JavaScript API and Places API');
  console.log('3. Add REACT_APP_GOOGLE_MAPS_API_KEY to your .env file');
  
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  console.log('Please run manually:');
  console.log('npm install @googlemaps/react-wrapper @googlemaps/js-api-loader');
}
