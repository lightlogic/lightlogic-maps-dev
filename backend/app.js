const path = require("path");
const dotenv = require('dotenv');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const colors = require("colors");

const geoEntityRoutes = require("./routes/geoentity");
const geoEntitiesRoutes = require("./routes/geoentities");
const listsRoutes = require("./routes/lists");
const userRoutes = require("./routes/user");

const app = express();

// Load env vars
dotenv.config({ path: './config/config.env' });

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

app.use("/", express.static(path.join(__dirname, "angular")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// from ./routes/geoentities.js (see import on top)
// in app.use, the "/api/geoentities" serves as a filter.
// only the routes starting with /api/geoentitites will be
// forwared in ./routes/geoentities.js
app.use("/api/geoentity", geoEntityRoutes);
app.use("/api/geoentities", geoEntitiesRoutes);
app.use("/api/lists", listsRoutes);
app.use("/api/user", userRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
