const { Kafka } = require('kafkajs');
const logger = require('../utils/logger');

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'user-service',
  brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['kafka:9092'],
  ssl: process.env.KAFKA_SSL === 'true',
  sasl: process.env.KAFKA_USERNAME ? {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD
  } : null,
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

// Test connection on startup
(async () => {
  try {
    const admin = kafka.admin();
    await admin.connect();
    logger.info('Successfully connected to Kafka cluster');
    await admin.disconnect();
  } catch (err) {
    logger.error('Failed to connect to Kafka cluster', err);
  }
})();

module.exports = kafka;
