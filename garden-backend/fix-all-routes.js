const fs = require('fs');
const path = require('path');

const routesDir = './src/routes';
const files = [
  'settingRoutes.js',
  'documentRoutes.js', 
  'auditLogRoutes.js',
  'feedbackRoutes.js',
  'aiAssistantRoutes.js',
  'weatherRoutes.js',
  'qrCodeRoutes.js',
  'reportRoutes.js',
  'postRoutes.js'
];

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ ${file} not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already fixed
  if (content.includes('{ requireAuth }')) {
    console.log(`✅ ${file} already fixed`);
    return;
  }
  
  // Fix import
  content = content.replace(
    /const auth = require\('\.\.\/middleware\/auth'\);/g,
    "const { requireAuth } = require('../middleware/auth');"
  );
  
  // Fix usage in routes
  content = content.replace(/, auth,/g, ', requireAuth,');
  content = content.replace(/router\.use\(auth\);/g, 'router.use(requireAuth);');
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed ${file}`);
});

console.log('All remaining route files fixed!');
