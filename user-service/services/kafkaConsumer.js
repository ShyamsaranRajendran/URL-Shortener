const kafka = require('../config/kafka');
const logger = require('../utils/logger');
const AuditLog = require('../models/AuditLog'); // Optional fallback

const consumer = kafka.consumer({ groupId: 'user-service-group' });

const startConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topics: ['audit-events'], fromBeginning: false });
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const event = JSON.parse(message.value.toString());
          
          // Process different event types
          switch (topic) {
            case 'audit-events':
              // Store in DB or forward to monitoring system
              await AuditLog.create(event); // Optional fallback storage
              logger.info(`Audit event processed: ${event.action}`);
              break;
          }
        } catch (err) {
          logger.error('Error processing Kafka message', err);
        }
      }
    });
    
    logger.info('Kafka Consumer started successfully');
  } catch (err) {
    logger.error('Failed to start Kafka Consumer', err);
    process.exit(1);
  }
};

const shutdownConsumer = async () => {
  try {
    await consumer.disconnect();
    logger.info('Kafka Consumer disconnected');
  } catch (err) {
    logger.error('Error disconnecting Kafka Consumer', err);
  }
};

module.exports = {
  startConsumer,
  shutdownConsumer
};