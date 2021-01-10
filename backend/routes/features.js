const express = require("express");
const request = require("superagent");
const bodyparser = require("body-parser");
const colors = require("colors");

const Feature = require("../models/feature");
const ldgeoadminModule = require("../utils/ldgeoadminUtils");
const apigeoadminModule = require("../utils/apigeoadminUtils");
const AdminUnit = require("../models/adminUnit");
const feature = require("../models/feature");

const router = express.Router();

router.use(bodyparser.json());

// post new commune based on name
// method POST
// path: /api/features/swisstopo
router.post("/swisstopo", (req, res, next) => {
  AdminUnit.findOne({ name: req.body.commName }, (error, auData) => {
    if (auData == undefined) {
      ldgeoadminModule.getBFScommuneData(req.body.commName, (cerror, communeData) => {
        if (cerror) {
          console.log(colors.red(cerror));
        } else {
          communeData.save().then((createAdminUnit) => {
            apigeoadminModule.getCommuneGeoJSON(
              createAdminUnit.bfsNum,
              (gerror, geoJsonData) => {
                if (gerror) {
                  console.log(colors.red(gerror));
                } else {
                  communeFeature = new Feature({
                    geoJSONraw: geoJsonData,
                    featureOf: createAdminUnit._id,
                  });
                  communeFeature.save().then((createdFeature) => {
                    res.status(201).json({
                      message: "Commune and geoJSON retrieved and cached.",
                      feature: createdFeature,
                    });
                  });
                }
              }
            );
          });
        }
      });
    } else {
      Feature.findOne({ featureOf: auData._id }, (ferror, fData) => {
        if (ferror) {
          console.log(colors.red(ferror));
        } else if (fData == undefined) {
          apigeoadminModule.getCommuneGeoJSON(
            auData.bfsNum,
            (gerror, geoJsonData) => {
              if (gerror) {
                console.log(colors.red(gerror));
              } else {
                communeFeature = new Feature({
                  geoJSONraw: geoJsonData,
                  featureOf: auData._id,
                });
                communeFeature.save().then((createdFeature) => {
                  res.status(201).json({
                    message: "Commune and geoJSON retrieved and cached.",
                    feature: createdFeature,
                  });
                });
              }
            }
          );
        } else {
          res.status(200).json({
            message: "Feature allready existed. No data added.",
            feature: null,
          });
        }
      });
    }
  });
});

// post custom feature from the formular
// method POST
// path: /api/features/custom
router.post("/custom", (req, res, next) => {
  // req.body is a new object added to the request by body-parser
  const feature = new Feature({
    //id: req.body.id,
    uri: req.body.uri,
    description: req.body.description,
    geoJSONraw: req.body.geoJSONraw,
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

module.exports = router;
