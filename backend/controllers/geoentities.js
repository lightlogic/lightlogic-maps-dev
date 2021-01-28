const GeoEntity = require("../models/geoEntity");
const geoEntityUtils = require("../utils/geoEntity/geoEntityUtils");

// @desc    Get all geoEntities. Available modes: metadata only, geometry only, full ( metadata | geojson | full)
// @route   GET /api/geoentities
// @access  Public
exports.getGeoentities = (req, res, next) => {
  GeoEntity.find()
    .then((documents) => {
      res.status(200).json({
        message: "Features fetched successfully !",
        features: documents,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching geoEntities failed!",
      });
    });
};

// @desc    Get one geoEntity. Available modes: metadata only, geometry only, full ( metadata | geojson | full)
// @route   GET /api/geoentities/:id
// @access  Public
exports.getGeoentity = (req, res, next) => {};

// @desc    Toogle select/unselect property of geoEntity
// @route   PATCH /api/geoentities/:id
// @access  Public
exports.toggleGeoEntitySelection = (req, res, next) => {
  console.log(req.params.id);
  console.log(req.body.selected);
  GeoEntity.updateOne(
    { _id: req.params.id },
    { selected: req.body.selected }
  ).then((result) => {
    res.status(200).json({ message: "Feature selected" });
  });
};

// @desc    Delete geoEntity
// @route   /api/geoentities/:id
// @access  Private
exports.deleteGeoEntity = (req, res, next) => {
  GeoEntity.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Feature deleted" });
  });
};

// @desc      Add a new commune geoEntity fetched from Swisstopo Search API based on the commune name
// @route     POST /api/geoentities/swisstopo/adminunit
// @access    Private
exports.addAdminUnit = (req, res, next) => {
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
};

// @desc    Add a new river geoEntity fetched from Swisstopo Search API based on river name
// @route   POST /api/geoentities/swisstopo/river
// @access  Private
exports.addRiver = (req, res, next) => {
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
};
