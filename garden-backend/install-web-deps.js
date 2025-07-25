// Script to install web scraping dependencies
const { execSync } = require('child_process');

console.log('Installing web scraping dependencies...');

try {
  // Install axios for HTTP requests
  console.log('Installing axios...');
  execSync('npm install axios', { stdio: 'inherit' });
  
  // Install cheerio for HTML parsing (optional, for future use)
  console.log('Installing cheerio...');
  execSync('npm install cheerio', { stdio: 'inherit' });
  
  console.log('✅ Dependencies installed successfully!');
  console.log('You can now fetch gardens from web sources.');
  
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  console.log('Please run manually:');
  console.log('npm install axios cheerio');
}
