const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const featuresRoutes = require('./routes/features');

const env = "development";
const config = require("./secrets.js")[env];

const app = express();

const mongoConnectURL =
  "mongodb+srv://" +
  config.database.mongoUser +
  ":" +
  config.database.mongoPass +
  "@" +
  config.database.mongoHost +
  "/" +
  config.database.mongoDBname +
  "?retryWrites=true";

mongoose
  .connect(mongoConnectURL)
  .then(() => {
    console.log("Connected to the database.");
  })
  .catch(() => {
    console.log("Connection failed.");
  });

// body-parser acts as an express middleware
// it parses the body of the request for json data and make it available as such in the response
app.use(bodyParser.json());
// body-parser can also parses the body for url encoded data and make it available
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// from ./routes/features.js (see import on top)
// in app.use, the "/api/features" serves as a filter.
// only the routes starting with /api/features will be
// forwared in ./routes/features.js
app.use("/api/features", featuresRoutes);



module.exports = app;
