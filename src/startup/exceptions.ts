import logger from "../startup/logger.ts";

export default () => {
  process.on("uncaughtException", (ex) => {
    logger.error(ex.message, ex);
    process.exit(1);
  });
};
