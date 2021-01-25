const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const colors = require("colors");

const GeoEntity = require("../models/geoEntity");
const checkAuth = require("../middleware/check-auth");
const geoEntityUtils = require("../utils/geoEntity/geoEntityUtils");

router.use(bodyparser.json());

// post new commune based on name
// method POST
// path: /api/geoentity/swisstopo
router.post("/swisstopo/adminunit", checkAuth, (req, res, next) => {
  const COMMUNE_TYPE_URI = process.env.ADMINUNIT_ISA_URI;
  const geoEntityType_Commune = process.env.ADMINUNIT_TYPE;
  const COMMUNE_DOMAIN_LABEL = "bfsNum";
  const layerBodID_communes =
    "ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill";

  GeoEntity.findOne({ name: req.body.commName }, (error, auData) => {
    if (auData == undefined) {
      // commune not yet cached
      // == > get commune metadata from SPARQLendpoint ld.geo.admin.ch and api3.geo.admin for geoJSON
      geoEntityUtils.createGeoEntity(
        req.body.commName,
        geoEntityType_Commune,
        COMMUNE_TYPE_URI,
        COMMUNE_DOMAIN_LABEL,
        (cerror, communeEntity) => {
          if (cerror) {
            console.log(colors.red(cerror));
          } else {
            geoEntityUtils.fetchGeoJson(
              communeEntity,
              layerBodID_communes,
              (gerror, geoJsonData) => {
                communeEntity.geoJSON = geoJsonData.geoJSON;
                communeEntity
                  .save()
                  .then((createdEntity) => {
                    res.status(201).json({
                      message: "Commune retrieved and cached.",
                      feature: createdEntity,
                    });
                  })
                  .catch((error) => {
                    res.status(500).json({
                      message: "Adding a new commune failed.",
                    });
                  });
              }
            );
          }
        }
      );
      // auData is defined => the metadata of this commune is allready cached in MongoDB
    } else {
      res.status(200).json({
        message:
          "Commune allready existed. No further data needed to be retrieved.",
        feature: null,
      });
    }
  });
});

// post new river based on name
// method POST
// path: /api/geoentity/swisstopo/river
router.post("/swisstopo/river", checkAuth, (req, res, next) => {
  RIVER_isA_URI = process.env.RIVER_ISA_URI;
  const geoEntityType_river = process.env.RIVER_TYPE;
  const domainIdLabel = "gewissNum";
  const layerBodId_rivers = "ch.bafu.vec25-gewaessernetz_2000";
  GeoEntity.findOne({ name: req.body.rivName }, (error, riverData) => {
    if (riverData == undefined) {
      // river not yet cached in DB
      // == > query wikidata for river unique id ans api3.geo.admin.ch for geoJSON
      geoEntityUtils.createGeoEntity(
        req.body.rivName,
        geoEntityType_river,
        RIVER_isA_URI,
        domainIdLabel,
        (cerror, riverEntity) => {
          geoEntityUtils.fetchGeoJson(
            riverEntity,
            layerBodId_rivers,
            (gerror, geoJsonData) => {
              if (gerror) {
                console.log(colors.red(gerror));
              } else {
                riverEntity.geoJSON = geoJsonData.geoJSON.results;
                riverEntity
                  .save()
                  .then((createdEntity) => {
                    res.status(201).json({
                      message: "River retrieved and cached.",
                      feature: createdEntity,
                    });
                  })
                  .catch((error) => {
                    res.status(500).json({
                      message: "Adding a new river failed.",
                    });
                  });
              }
            }
          );
        }
      );
      //riverData is defined => the metadata of this commune is allready cached in MongoDB
    } else {
      res.status(200).json({
        message:
          "Feature allready existed. No further data needed to be retrieved.",
        feature: null,
      });
    }
  });
});

// method GET one geoEntity
// path: /api/geoentity
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

// method GET one geoEntity
// path: /api/geoentity/metadata
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

// method GET one geoEntity
// path: /api/geoentity/geojson
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

// methode PATCH
// path: /api/geoentity/select/fi111jej3iojofidj
router.patch("/select/:id", (req, res, next) => {
  GeoEntity.updateOne(
    { _id: req.params.id },
    { selected: req.body.selected }
  ).then((result) => {
    res.status(200).json({ message: "Feature selected" });
  });
});

// methode DELETE
// path: /api/geoentity/fi111jej3iojofidj
router.delete("/:id", checkAuth, (req, res, next) => {
  GeoEntity.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Feature deleted" });
  });
});

module.exports = router;
