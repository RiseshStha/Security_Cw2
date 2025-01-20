const winston = require('winston');

// Configure winston logger
const logger = winston.createLogger({
  level: 'info', // Log levels: error, warn, info, http, verbose, debug, silly
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'logs/activity.log' }), // Log to file
  ],
});

module.exports = logger;
