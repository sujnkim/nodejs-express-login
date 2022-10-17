const express = require("express");
const app = express();
const dotenv = require("dotenv");
const logger = require("./config/logger");
const morgan = require("morgan");
const morganMiddleware = require("./middleware/morganMiddleware");
const cookeParser = require("cookie-parser");
const ROLES_LIST = require("./config/roles_list");
const rolesMiddleware = require("./middleware/rolesMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const connectDB = require("./config/connectDB");
const PORT = process.env.PORT || 3000;

dotenv.config(); //process.env

/*--Middleware--*/
connectDB(); //MongoDB Connection

app.use(morgan("dev"));
app.use(morganMiddleware);

//built-in middleware to handle urlencoded from data
app.use(express.urlencoded({ extended: true }));

//built-in middleware for JSON
app.use(express.json());

//middleware for cookies
app.use(cookeParser());

/*--Routes--*/
//root page 라우터
app.use("/", require("./routes/root"));

//user정보 관련 라우터
app.use("/users", require("./routes/users"));

//user정보 관련 라우터
app.use("/refresh", require("./routes/refresh"));

//admin 라우터
app.use(authMiddleware);
app.use(rolesMiddleware(ROLES_LIST.Admin));
app.use("/admin", require("./routes/admin"));

/*--Error Handling--*/
//custom 404
app.use(function (req, res, next) {
  logger.error(`${err.name}: ${err.message}`);
  res.status(404).send("404 Not Found");
});

//custom Error(500) Handling Middleware
//After everyting even 404
app.use(errorHandler);

/*
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB...");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
});
*/

//MongoDB Error Logging
mongoose.connection.on("error", (error) => {
  console.log("MongoDB connection Error", error);
  logger.error(error);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
