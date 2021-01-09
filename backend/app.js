const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const colors = require("colors");

const featuresRoutes = require('./routes/features');

const app = express();

mongoose
  // Mongo connection string example
  // mongodb+srv://myDummyUser:myDummyPassword@myMongoSererHost/myDatabaseName?retryWrites=true
  .connect(process.env.MONGO_ATLAS_CONN)
  .then(() => {
    console.log(colors.green("Connected to the database."));
  })
  .catch(() => {
    console.log(colors.red("Connection failed."));
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
