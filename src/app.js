const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const helmet = require("helmet");

const v1 = require("./routes/v1");
const app = express();
// ------------------- DB Config ------------------- //
main()
  .then(() => console.log("mongodb is connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_DB_URL);
}

// ------------------- Middlewares ------------------- //
app.use(logger("dev"));

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: process.env.JWT_SECRET }));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// ------------------- Routes ------------------- //

// http://hostname/api/v1/endpointname
app.use("/api/v1", v1);

// ------------------- Errors ------------------- //
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  //handeling
  const status = err.status || 500;
  const error = err.message || "Error processing your request";

  res.status(status).send({
    error,
  });
});

module.exports = app;
