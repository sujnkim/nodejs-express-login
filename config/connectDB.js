const mongoose = require("mongoose");
const logger = require("../config/logger");

const connectDB = () =>
  mongoose
    .connect(
      process.env.DATABASE_URI /*{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
}*/
    )
    .then(() => {
      console.log("MongoDB Connected...");
    })
    .catch((err) => {
      logger.error(err);
    });

module.exports = connectDB;
