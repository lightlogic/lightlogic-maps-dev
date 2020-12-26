const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const env = "development";
const config = require("./secrets.js")[env];

const Feature = require("./models/feature");

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

app.post("/api/features", (req, res, next) => {
  // req.body is a new object added to the request by body-parser
  const feature = new Feature({
    //id: req.body.id,
    uri: req.body.uri,
    description: req.body.description,
    wktGeometry: req.body.wktGeometry,
    projection: req.body.projection,
  });
  feature.save().then((createdFeature) => {
    res.status(201).json({
      message: "Feature added sucessfully",
      featureId: createdFeature._id,
    });
  });
});

app.get("/api/features", (req, res, next) => {
  Feature.find().then((documents) => {
    res.status(200).json({
      message: "Features fetched successfully !",
      features: documents,
    });
  });
});

app.delete("/api/features/:id", (req, res, next) => {
  Feature.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post deleted" });
  });
});

module.exports = app;
