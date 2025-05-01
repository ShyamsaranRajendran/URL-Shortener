const { createLogger, format, transports } = require('winston');

// Create the logger
const logger = createLogger({
  level: 'info',  // Default level: info (change to 'debug' if needed)
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} ${level}: ${stack || message}`;
    })
  ),
  transports: [
    new transports.Console()
  ]
});

// Stream for morgan (if you use morgan for HTTP logging)
logger.stream = {
  write: (message) => logger.info(message.trim())
};

module.exports = logger;
