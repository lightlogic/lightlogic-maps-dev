const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const colors = require("colors");

const GeoEntity = require("../models/geoEntity");
const Feature = require("../models/feature");

const geoEntityUtils = require("../utils/geoEntity/geoEntityUtils");

router.use(bodyparser.json());

// post new commune based on name
// method POST
// path: /api/features/swisstopo
router.post("/swisstopo/adminunit", (req, res, next) => {
  const geoEntityType_Commune = "commune";
  const COMMUNE_TYPE_URI = "http://www.geonames.org/ontology#A.ADM3";
  const COMMUNE_DOMAIN_LABEL = "bfsNum";
  const layerBodID_communes =
    "ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill";
  const layerName_communes = "Gemeindegrenzen";
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
                if (gerror) {
                  console.log(colors.red(gerror));
                } else {
                  communeEntity.geoJSON = geoJsonData.geoJSON;
                  communeEntity.save().then((createdCommune) => {
                    res.status(201).json({
                      message: "Commune retrieved and cached.",
                      feature: createdCommune,
                    });
                  });
                }
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
// path: /api/features/swisstopo/river
router.post("/swisstopo/river", (req, res, next) => {
  const geoEntityType_river = "river";
  RIVER_isA_URI = "https://www.wikidata.org/wiki/Q4022";
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
          if (cerror) {
            console.log(colors.red(cerror));
          } else {
            geoEntityUtils.fetchGeoJson(
              riverEntity,
              layerBodId_rivers,
              (gerror, geoJsonData) => {
                if (gerror) {
                  console.log(colors.red(gerror));
                } else {
                  riverEntity.geoJSON = geoJsonData.geoJSON.results;
                  riverEntity.save().then((createdRiver) => {
                    res.status(201).json({
                      message: "River retrieved and cached.",
                      feature: createdRiver,
                    });
                  });
                }
              }
            );
          }
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

module.exports = router;
