const express = require('express');
const dotenv = require('dotenv');

// Load environment variables first
dotenv.config();

// Add error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error('Error:', err.name, err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error('Error:', err.name, err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

console.log('🚀 Starting Garden Management API...');

try {
  // Import dependencies with error handling
  const cors = require('cors');
  const connectDB = require('./src/config/db');
  const helmet = require('helmet');
  const rateLimit = require('express-rate-limit');
  const morgan = require('morgan');
  const logger = require('./src/utils/logger');
  const swaggerUi = require('swagger-ui-express');
  const YAML = require('yamljs');

  console.log('✅ Core dependencies loaded');

  // Load swagger document
  const swaggerDocument = YAML.load('./docs/swagger.yaml');
  console.log('✅ Swagger documentation loaded');

  // Load security middleware
  const {
    sanitizeInput,
    requestSizeLimit,
    securityHeaders,
    apiVersioning,
    requestLogger,
    healthCheck,
    mongoSanitize
  } = require('./src/middleware/security');

  console.log('✅ Security middleware loaded');

  // Suppress Mongoose warnings for cleaner output
  const mongoose = require('mongoose');
  mongoose.set('strictQuery', false);

  // Load all route modules
  const authRoutes = require('./src/routes/authRoutes');
  const eventRoutes = require('./src/routes/eventRoutes');
  const plotRoutes = require('./src/routes/plotRoutes');
  const taskRoutes = require('./src/routes/taskRoutes');
  const waterRoutes = require('./src/routes/waterRoutes');
  const gardenRoutes = require('./src/routes/gardenRoutes');
  const applicationRoutes = require('./src/routes/applicationRoutes');
  const volunteerRoutes = require('./src/routes/volunteerRoutes');
  const notificationRoutes = require('./src/routes/notificationRoutes');
  const paymentRoutes = require('./src/routes/paymentRoutes');
  const mediaRoutes = require('./src/routes/mediaRoutes');
  const scheduleRoutes = require('./src/routes/scheduleRoutes');
  const reportRoutes = require('./src/routes/reportRoutes');
  const settingRoutes = require('./src/routes/settingRoutes');
  const documentRoutes = require('./src/routes/documentRoutes');
  const auditLogRoutes = require('./src/routes/auditLogRoutes');
  const feedbackRoutes = require('./src/routes/feedbackRoutes');
  const aiAssistantRoutes = require('./src/routes/aiAssistantRoutes');
  const weatherRoutes = require('./src/routes/weatherRoutes');
  const qrCodeRoutes = require('./src/routes/qrCodeRoutes');

  const postRoutes = require('./src/routes/postRoutes');
  const communityStatsRoutes = require('./src/routes/communityStats');
  const dashboardRoutes = require('./src/routes/dashboardRoutes');
  const chatRoutes = require('./src/routes/chatRoutes');

  console.log('✅ All route modules loaded');

  // Initialize Express app
  const app = express();

  console.log('✅ Express app initialized');

  // Connect to database
  connectDB();

  console.log('✅ Database connection initiated');

  // Basic middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api/events', eventRoutes);

// Enhanced Security Configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.openweathermap.org"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Enhanced Rate Limiting with different tiers
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Increased for general API usage
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/';
  }
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Strict limit for sensitive operations
  message: {
    success: false,
    error: 'Too many sensitive requests. Please try again later.',
    code: 'STRICT_RATE_LIMIT'
  }
});

app.use(generalLimiter);

// Enhanced Security Middleware
app.use(securityHeaders);
app.use(requestSizeLimit);
app.use(mongoSanitize);
app.use(sanitizeInput);
app.use(apiVersioning);

// Logging
app.use(requestLogger);
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// Connect to MongoDB
connectDB();

//Connecting to swagger for documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get('/health', healthCheck);
app.get('/', (req, res) => {
  res.json({
    message: 'Garden Management System API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Routes connection
app.use('/api/auth', authRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/waterlogs', waterRoutes);
app.use('/api/gardens', gardenRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/ai-assistant', aiAssistantRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/qrcodes', qrCodeRoutes);

app.use('/api/posts', postRoutes);
app.use('/api/community', communityStatsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Example route
app.get('/', (req, res) => {
  res.send('Community Garden API running 🌿');
});

// Error handling middleware
const { globalErrorHandler, notFound } = require('./src/middleware/errorHandler');
app.use(notFound);
app.use(globalErrorHandler);

  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🌱 Garden Management API running on port ${PORT}`);
    logger.info(`Server running on port ${PORT}`);
  });

} catch (error) {
  console.error('💥 Failed to start server:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}