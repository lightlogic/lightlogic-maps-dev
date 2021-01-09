const express = require("express");
const request = require("superagent");
const bodyparser = require("body-parser");
const colors = require("colors");

const Feature = require("../models/feature");
const getSwisstopoCommuneFeature = require("../utils/swisstopoCommuneFeatures");

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
    selected: false,
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
    res.status(200).json({ message: "Feature deleted" });
  });
});

// methode PATCH
// path: /api/features/select/fi111jej3iojofidj
router.patch("/select/:id", (req, res, next) => {
  Feature.updateOne(
    { _id: req.params.id },
    { selected: req.body.selected }
  ).then((result) => {
    res.status(200).json({ message: "Feature selected" });
  });
});

router.get("/:communeName", (req, res, next) => {
  getSwisstopoCommuneFeature(req.params.communeName, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(colors.magenta(data));
      const swisstopoFeature = new Feature({
        uri: data.featureId,
        description: data.properties.label,
        wktGeometry: "null",
        geoJSONraw: data,
        projection: "EPSG:2058",
        selected: false,
      });
      swisstopoFeature.save().then((createdFeature) => {
        res.status(200).json({
          message: "Commune " + data.properties.label + " found.",
          feature: data,
        });
      });
    }
  });
});

module.exports = router;
