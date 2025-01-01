import { connect } from "mongoose";
import logger from "../startup/logger.ts";
import config from "config";

export default () => {
  const db = config.get("db") as string;
  connect(db).then(() => logger.info(`Connected to ${db}...`));
};
