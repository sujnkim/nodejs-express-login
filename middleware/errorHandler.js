const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name}/ ${err.message}`);
  console.error(err.stack);
  res.status(500).send(err.message); //display on browser
};

module.exports = errorHandler;
