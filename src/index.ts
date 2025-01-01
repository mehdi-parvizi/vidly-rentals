import dotenv from "dotenv";
dotenv.config();
import express from "express";
import db from "./startup/db.ts";
import "express-async-errors";
import handleExceptions from "./startup/exceptions.ts";
import routes from "./startup/routes.ts";
import logger from "./startup/logger.ts";
import config from "./startup/config.ts";
import prod from "./startup/prod.ts";

export const app = express();
prod(app);
config();
handleExceptions();
db();
routes(app);

const port = process.env.PORT || 3000;
export const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);
