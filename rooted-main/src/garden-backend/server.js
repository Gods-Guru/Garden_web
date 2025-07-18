const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const logger = require('./src/utils/logger');

dotenv.config();

const authRoutes = require('./src/routes/authRoutes');
const plotRoutes = require('./src/routes/plotRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const waterRoutes = require('./src/routes/waterRoutes');
const gardenRoutes = require('./src/routes/gardenRoutes');

const app = express();
app.use(cors());
app.use(express.json());

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

// Routes connection
app.use('/api/auth', authRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/waterlogs', waterRoutes);
app.use('/api/gardens', gardenRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('Community Garden API running 🌿');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));