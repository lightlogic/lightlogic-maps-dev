const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const colors = require("colors");

const GeoEntity = require("../models/geoEntity");

router.use(bodyparser.json());


// method GET (all geoEntities)
// path: /api/geoentities
// full objects with metadata AND geometry (geoJSON)
router.get("", (req, res, next) => {
  //TODO fix code to get geoEntity
  GeoEntity.find().then((documents) => {
    res.status(200).json({
      message: "Features fetched successfully !",
      features: documents,
    });
  });
});

// method GET (all geoEntities)
// path: /api/geoentities/metadata
// only retrieve metadata (no geometry)
router.get("/metadata", (req, res, next) => {
  //TODO fix code to get geoEntity
  GeoEntity.find().then((documents) => {
    res.status(200).json({
      message: "Features fetched successfully !",
      features: documents,
    });
  });
});

// method GET (all geoEntities)
// path: /api/geoentities/geojson
// only retrieve geometry (geoJSON)
router.get("/geojson", (req, res, next) => {
  //TODO fix code to get geoEntity
  GeoEntity.find().then((documents) => {
    res.status(200).json({
      message: "Features fetched successfully !",
      features: documents,
    });
  });
});

module.exports = router;
