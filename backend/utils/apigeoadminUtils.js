const request = require("superagent");
const colors = require("colors");

const Feature = require("../models/feature");
const AdminUnit = require("../models/adminUnit");

// Module fetching data from http://api3.geo.admin.ch/services/sdiservices.html#feature-resource
// Feature Resource
// With an ID (or several in a comma separated list) and a layer ID (technical name),
// this service can be used to retrieve a feature resource.
module.exports = {
  getCommuneGeoJSON: function (communeBFSnum, callback) {
    API_URL = "https://api3.geo.admin.ch/rest/services/api/MapServer/";
    LAYER_ID = "ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill";
    PROJECTION = "2056";

    request
      .get(
        API_URL +
        LAYER_ID +
        "/" +
        communeBFSnum +
        "?geometryFormat=geojson&sr=" +
        PROJECTION
      )
      .end((err, res) => {
        if (err) {
          callback(err);
        } else {
          callback(undefined, res.body.feature);
        }
      });
  },
};
