// Register eventRoutes after app is initialized
const eventRoutes = require('./src/routes/eventRoutes');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const logger = require('./src/utils/logger');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');

dotenv.config();


const authRoutes = require('./src/routes/authRoutes');
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

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/events', eventRoutes);

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    errorCode: 'RATE_LIMIT',
    message: 'Too many requests, please try again later.'
  }
});
app.use(limiter);

// Logging
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// Connect to MongoDB
connectDB();

//Connecting to swagger fpr documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
  logger.info(`Server running on port ${PORT}`);
});