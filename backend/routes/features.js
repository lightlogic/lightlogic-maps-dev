const express = require("express");
const bodyparser = require("body-parser");
const colors = require("colors");

const Feature = require("../models/feature");
const ldgeoadminModule = require("../utils/ldgeoadminUtils");
const apigeoadminModule = require("../utils/apigeoadminUtils");
const AdminUnit = require("../models/adminUnit");

const router = express.Router();

router.use(bodyparser.json());

// post new commune based on name
// method POST
// path: /api/features/swisstopo
router.post("/swisstopo", (req, res, next) => {
  AdminUnit.findOne({ name: req.body.commName }, (error, auData) => {
    if (auData == undefined) {
      // commune not in MongoDB therefor the limits of it geoJSON Feature will not as well
      // == > get commune metadata from SPARQLendpoint ld.geo.admin.ch
      ldgeoadminModule.getBFScommuneData(
        req.body.commName,
        (cerror, communeData) => {
          if (cerror) {
            console.log(colors.red(cerror));
          } else {
            // saving commune metadata to the DB ("AdminUnit" Mongoose model)
            communeData.save().then((createAdminUnit) => {
              // retrieving the limit of the commune
              // == > get commune limits geoJSON from api3.geo.admin.ch
              apigeoadminModule.getCommuneGeoJSON(
                createAdminUnit.bfsNum,
                (gerror, geoJsonData) => {
                  if (gerror) {
                    console.log(colors.red(gerror));
                  } else {
                    communeFeature = new Feature({
                      geoJSONraw: geoJsonData,
                      featureOf: createAdminUnit._id,
                      featureOfLabel: createAdminUnit.name,
                      featureOfbfsNum: createAdminUnit.bfsNum,
                    });
                    // saving commune limits to the DB ("feature" Mongoose model)
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
        }
      );
      // auData is defined => the metadata of this commune is allready cached in MongoDB
    } else {
      // search for matching commune limits in the feature collection of MongoDB
      Feature.findOne({ featureOf: auData._id }, (ferror, fData) => {
        if (ferror) {
          console.log(colors.red(ferror));
          // if no matching commune limits are found
          // == > get commune limits geoJSON from api3.geo.admin.ch
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
                  featureOfLabel: auData.name,
                  featureOfbfsNum: auData.bfsNum,
                });
                communeFeature.save().then((createdFeature) => {
                  res.status(201).json({
                    message:
                      "Commune was allready cached but the geoJSON needed to be retrieved and cached.",
                    feature: createdFeature,
                  });
                });
              }
            }
          );
          // both the commune and the commune's limits were allready cached in the DB.
          // there is no reason to add this metadata or this feature. Neither to the MongoDB Cache and neither to the features array in the front end
          // => no data is returned from the backend
        } else {
          res.status(200).json({
            message:
              "Feature allready existed. No further data needed to be retrieved.",
            feature: null,
          });
        }
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
