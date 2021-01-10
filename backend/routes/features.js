const express = require("express");
const request = require("superagent");
const bodyparser = require("body-parser");
const colors = require("colors");

const Feature = require("../models/feature");
const ldgeoadminModule = require("../utils/ldgeoadminUtils");
const AdminUnit = require("../models/adminUnit");
const feature = require("../models/feature");

const router = express.Router();

router.use(bodyparser.json());

// post new commune based on name
// method POST
// path: /api/features/swisstopo
router.post("/swisstopo", (req, res, next) => {
  AdminUnit.findOne({ name: "Ins" }, (error, auData) => {
    if (auData == undefined) {
      ldgeoadminModule.getBFScommuneData("Ins", (cerror, communeData) => {
        if (cerror) {
          console.log(colors.red(cerror));
        } else {
          communeData.save().then((createAdminUnit) => {
            communeFeature = new Feature({
              geoJSONraw: "{blabla geoJSON}",
              featureOf: createAdminUnit._id,
            });
            communeFeature.save().then((createdFeature) => {
              res.status(201).json({
                message: "Commune and geoJSON retrieved and cached.",
                feature: createdFeature,
              });
            });
          });
        }
      });
    } else {
      Feature.findOne({ featureOf: auData._id }, (ferror, fData) => {
        //Feature.findOne({ featureOf: "1" }, (ferror, fData) => {
        if (ferror) {
          console.log(colors.red(ferror));
        } else if (fData == undefined) {
          communeFeature = new Feature({
            geoJSONraw: "{blabla geoJSON}",
            featureOf: auData._id,
          });
          communeFeature.save().then((createdFeature) => {
            res.status(201).json({
              message: "geoJSON retrieved and cached.",
              feature: createdFeature,
            });
          });
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
// ldgeoadminModule.addCommuneFeature("Ins", (error, data) => {
//   if (error) {
//     console.log(colors.red(error));
//   } else {
//     filter = { uri: data.uri };
//     update = data;
//     options = { upsert: true, new: true, setDefaultsOnInsert: true };
//     AdminUnit.findOneAndUpdate(filter, update, options, function(error, results) {
//       if (error) {
//         console.log(colors.red(error))
//         communeFeature = new Feature({
//             geoJSONraw: "{blabla geoJSON}",
//             featureOf: results._id,
//         });
//         ffilter = {featureOf: results._id };
//         fupdate = communeFeature;
//         Feature.findOneAndUpdate(ffilter, fupdate, options, function(error, fresults) {
//           if (error) {
//             console.log(colors.white(error))
//           } else {
//             console.log(colors.magenta(fresults))
//           }
//         })
//       } else {
//         console.log(colors.magenta(results));
//       }
//     })
//     // data.save().then((createdAdminUnit) => {
//     //   //console.log(colors.green(createdAdminUnit._id));
//     //   communeFeature = new Feature({
//     //     geoJSONraw: "{blabla geoJSON}",
//     //     featureOf: createdAdminUnit._id,
//     //   });
//     //   communeFeature.save().then((createdFeature) => {
//     //     console.log(colors.magenta(createdFeature));
//     //   });
//     // });
//     }
//   });
// });

// ldgeoadminModule.getSwisstopoCommuneFeature(req.body.communeName, (error, data) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(colors.white(data));
//     const swisstopoFeature = new Feature({
//       uri: data.featureId,
//       description: data.properties.label,
//       wktGeometry: "null",
//       geoJSONraw: data,
//       projection: "EPSG:2058",
//       selected: false,
//     });
//     swisstopoFeature.save().then((createdFeature) => {
//       res.status(200).json({
//         message: "Commune " + data.properties.label + " found.",
//         feature: data,
//       });
//     });
//   }
// });

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
