import { Request, Response, NextFunction } from "express";
import logger from "../startup/logger.ts";

const error = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, err);
  res.status(500).send("Unexpected error");
};
export default error;
