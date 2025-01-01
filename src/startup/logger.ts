import winston from "winston";
import "winston-mongodb";

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({
      filename: "logger.log",
    }),
    new winston.transports.Console({ format: winston.format.colorize() }),
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: "exceptions.log",
      handleExceptions: true,
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.colorize()
      ),
    }),
  ],
});

export default logger;
