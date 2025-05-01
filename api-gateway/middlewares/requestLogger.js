const requestLogger = (req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
  };
  
  module.exports = requestLogger;
  