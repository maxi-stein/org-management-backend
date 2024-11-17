import winston from 'winston';
import config from 'config';

const { combine, timestamp, printf, prettyPrint, errors } = winston.format;

const customFormat = printf((info) => {
  const baseMessage = `${info.timestamp} ${info.level}: ${info.message} (context: ${info.context})`;
  return info.stack ? `${baseMessage}\n${info.stack}` : baseMessage;
});

export const logger = winston.createLogger({
  level: config.logger.console.level,
  format: combine(
    errors({ stack: true }),
    timestamp(),
    prettyPrint(),
    customFormat,
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        errors({ stack: true }),
        timestamp(),
        winston.format.colorize(),
        customFormat,
      ),
    }),
    new winston.transports.File({ filename: 'api-errors.log', level: 'error' }),
  ],
});
