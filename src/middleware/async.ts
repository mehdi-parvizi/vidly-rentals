import { Request, Response, NextFunction, Handler } from "express";
import logger from "../startup/logger.ts";
import { LogEntry } from "winston";
const async =
  (handler: Handler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      logger.error(error as LogEntry);

      next(error);
    }
  };

export default async;
