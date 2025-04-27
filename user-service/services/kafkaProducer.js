const kafka = require('../config/kafka');
const logger = require('../utils/logger');

const producer = kafka.producer();
let isConnected = false;

const connectProducer = async () => {
  if (!isConnected) {
    try {
      await producer.connect();
      isConnected = true;
      logger.info('Kafka Producer connected');
    } catch (err) {
      logger.error('Failed to connect Kafka Producer', err);
      throw err;
    }
  }
};

const sendEvent = async (topic, event) => {
  try {
    if (!isConnected) await connectProducer();
    
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify({
            ...event,
            timestamp: new Date().toISOString(),
            service: 'user-service'
          })
        }
      ]
    });
  } catch (err) {
    logger.error(`Failed to send event to ${topic}`, err);
    // Implement fallback mechanism here if needed
  }
};

module.exports = {
  sendAuthEvent: (event) => sendEvent('auth-events', event),
  sendAuditEvent: (event) => sendEvent('audit-events', event),
  disconnect: async () => {
    if (isConnected) {
      await producer.disconnect();
      isConnected = false;
    }
  }
};