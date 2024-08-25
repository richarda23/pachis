import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Default level
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Function to change log level at runtime
export const setLogLevel = (level: string) => {
  logger.level = level;
};

export default logger;
