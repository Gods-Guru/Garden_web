const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// Add error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error('Error:', err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error('Error:', err.name, err.message);
  process.exit(1);
});

console.log('🚀 Starting Garden Management API...');

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Garden Management System API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Load essential routes
try {
  const authRoutes = require('./src/routes/authRoutes');
  const gardenRoutes = require('./src/routes/gardenRoutes');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/gardens', gardenRoutes);
  
  console.log('✅ Essential routes loaded');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

// Error handling middleware
const { globalErrorHandler, notFound } = require('./src/middleware/errorHandler');
app.use(notFound);
app.use(globalErrorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🌱 Garden Management API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🏠 Home: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

module.exports = app;
