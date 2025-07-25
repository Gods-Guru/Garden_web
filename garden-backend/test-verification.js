// Test file to check VerificationService import
console.log('Testing VerificationService import...');

try {
  const VerificationService = require('./src/services/VerificationService');
  console.log('✅ VerificationService imported successfully');
  console.log('Type:', typeof VerificationService);
  console.log('Constructor:', VerificationService.constructor.name);
  console.log('Methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(VerificationService)));
  
  // Test using it
  const verificationService = VerificationService;
  console.log('✅ Can assign to variable');
  
  // Test calling a method
  const code = verificationService.generateCode();
  console.log('✅ Can call generateCode():', code);
  
} catch (error) {
  console.error('❌ Error importing VerificationService:', error.message);
  console.error('Stack:', error.stack);
}

console.log('\nTesting authController import...');

try {
  const authController = require('./src/controllers/authController');
  console.log('✅ authController imported successfully');
} catch (error) {
  console.error('❌ Error importing authController:', error.message);
  console.error('Stack:', error.stack);
}
