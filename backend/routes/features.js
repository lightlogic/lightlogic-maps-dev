const express = require("express");
const request = require("superagent");
const bodyparser = require("body-parser");

const Feature = require("../models/feature");
const { getTokenSourceMapRange } = require("typescript");

const router = express.Router();

router.use(bodyparser.json());

// method POST
// path: /api/features
router.post("", (req, res, next) => {
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

// method GET
// path: /api/features
router.get("", (req, res, next) => {
  Feature.find().then((documents) => {
    res.status(200).json({
      message: "Features fetched successfully !",
      features: documents,
    });
  });
});

// methode DELETE
// path: /api/features/fi111jej3iojofidj
router.delete("/:id", (req, res, next) => {
  Feature.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post deleted" });
  });
});

router.get("/:query", (req, res, next) => {
  const communeName = req.params.query.substring(req.params.query.indexOf("%22")+3,req.params.query.indexOf("%22+"));
  console.log(communeName);
  request
    .post("https://ld.geo.admin.ch/query")
    .send(req.params.query)
    .set("Accept", "application/sparql-results+json")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .then((response) => {
      const swisstopoFeature = new Feature({
        id: null,
        uri: response.body.results.bindings[0].Commune.value,
        description: communeName,
        wktGeometry: response.body.results.bindings[0].WKT.value,
        projection: "EPSG:3857",
      });
      res.status(200).json(swisstopoFeature);
    });
});

module.exports = router;
