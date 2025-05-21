require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { query } = require('./config/db');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
// const { startConsumer } = require('./services/kafkaConsumer');
const logger = require('./utils/logger');
const redis = require('./config/redis'); // Ensure the Redis client is correctly imported

const app = express();

app.use(express.json());
// // Start Kafka consumer if enabled
// if (process.env.KAFKA_CONSUMER_ENABLED === 'true') {
//   startConsumer().catch(err => {
//     logger.error('Failed to start Kafka consumer:', err);
//     process.exit(1);
//   });
// }

// Security middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/', authRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await query('SELECT 1');
    
    // Check Redis connection
    await redis.ping(); // Assuming redis client has a 'ping' method

    res.json({ 
      status: 'healthy',
      services: {
        database: 'connected',
        redis: 'connected',
        kafka: process.env.KAFKA_CONSUMER_ENABLED === 'true' ? 'connected' : 'disabled'
      }
    });
  } catch (err) {
    logger.error('Health check failed:', err);
    res.status(500).json({ 
      status: 'unhealthy',
      error: err.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  
  try {
    // Disconnect Kafka producer
    await require('./services/kafkaProducer').disconnect();
    
    // Shutdown Kafka consumer if enabled
    if (process.env.KAFKA_CONSUMER_ENABLED === 'true') {
      await require('./services/kafkaConsumer').shutdownConsumer();
    }
    
    // Close Redis connection (optional, if you're using Redis)
    if (redis) {
      await redis.quit();
    }
    
    process.exit(0);
  } catch (err) {
    logger.error('Graceful shutdown failed:', err);
    process.exit(1);
  }
});

// Server initialization
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
