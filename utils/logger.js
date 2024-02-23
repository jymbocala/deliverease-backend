import winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    )
});

export default logger;
