import winston from "winston";


const { WINSTON_FOLDER = 'logs' } = process.env;

export const getWinstonFilePath = (filename: string): string => `${WINSTON_FOLDER}/${filename}`;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: getWinstonFilePath("error.log"), level: 'error' }),
    new winston.transports.File({ filename: getWinstonFilePath("combined.log") })
  ],
});

export default logger;
