import winston from 'winston';
import config from 'config';

const { combine, timestamp, printf, prettyPrint, errors } = winston.format;

export const logger = winston.createLogger({
  level: config.logger.console.level,
  formats: combine(
    errors({ stack: true }),
    timestamp(),
    prettyPrint(),
    printf(
      (info) =>
        `${info.timestamp} ${info.level}: ${info.message} (context: ${info.context})`,
    ),
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        errors({ stack: true }),
        timestamp(),
        winston.format.colorize(),
        printf(
          (info) =>
            `${info.timestamp} ${info.level}: ${info.message} (context: ${info.context})`,
        ),
      ),
    }),
    new winston.transports.File({ filename: 'api-errors.log', level: 'error' }),
  ],
});
