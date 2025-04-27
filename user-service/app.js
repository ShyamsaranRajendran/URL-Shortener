require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { startConsumer } = require('./services/kafkaConsumer');
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();

// Start Kafka Consumer if enabled
if (process.env.KAFKA_CONSUMER_ENABLED === 'true') {
  startConsumer().catch(err => {
    console.error('Failed to start Kafka Consumer', err);
    process.exit(1);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await mongoose.disconnect();
  await require('./services/kafkaProducer').disconnect();
  if (process.env.KAFKA_CONSUMER_ENABLED === 'true') {
    await require('./services/kafkaConsumer').shutdownConsumer();
  }
  process.exit(0);
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/sessions', sessionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));