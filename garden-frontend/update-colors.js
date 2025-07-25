import fs from 'fs';

const filePath = './src/styles/pagestyles/Home-modern.scss';
let content = fs.readFileSync(filePath, 'utf8');

// Replace purple gradients with green/brown gradients
content = content.replace(/#667eea/g, '#2d5016'); // Dark forest green
content = content.replace(/#764ba2/g, '#8b4513'); // Saddle brown

// Replace yellow/orange gradients with green gradients
content = content.replace(/#fbbf24/g, '#22c55e'); // Green-500
content = content.replace(/#f59e0b/g, '#16a34a'); // Green-600

// Update rgba values for the new colors
content = content.replace(/rgba\(102, 126, 234/g, 'rgba(45, 80, 22'); // Dark green rgba
content = content.replace(/rgba\(118, 75, 162/g, 'rgba(139, 69, 19'); // Brown rgba
content = content.replace(/rgba\(251, 191, 36/g, 'rgba(34, 197, 94'); // Green rgba

fs.writeFileSync(filePath, content);
console.log('✅ Updated all colors to green/brown theme!');
