const express = require("express");
const request = require("superagent");
const bodyparser = require("body-parser");

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
    res.status(200).json({ message: "Post deleted" });
  });
});

router.get("/:communeName", (req, res, next) => {
  getSwisstopoCommuneFeature(req.params.communeName, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      const swisstopoFeature = new Feature(data);
      swisstopoFeature.save();
      res.status(201).json(data);
    }
  });
});

module.exports = router;
