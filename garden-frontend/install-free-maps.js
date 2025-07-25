// Script to install FREE map dependencies (no Google required!)
const { execSync } = require('child_process');

console.log('Installing FREE professional map dependencies...');

try {
  // Install Leaflet (free alternative to Google Maps)
  console.log('Installing react-leaflet (FREE Google Maps alternative)...');
  execSync('npm install react-leaflet leaflet', { stdio: 'inherit' });
  
  // Install additional map features
  console.log('Installing leaflet plugins for extra features...');
  execSync('npm install leaflet.markercluster leaflet-defaulticon-compatibility', { stdio: 'inherit' });
  
  console.log('✅ FREE map dependencies installed successfully!');
  console.log('🎉 You now have:');
  console.log('  - Professional interactive maps (FREE)');
  console.log('  - Real garden data from OpenStreetMap (FREE)');
  console.log('  - Satellite imagery (FREE)');
  console.log('  - Custom markers and popups (FREE)');
  console.log('  - Mobile responsive design (FREE)');
  console.log('  - Zero ongoing costs!');
  
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  console.log('Please run manually:');
  console.log('npm install react-leaflet leaflet leaflet.markercluster leaflet-defaulticon-compatibility');
}
