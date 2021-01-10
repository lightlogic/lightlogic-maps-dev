const request = require("superagent");
const colors = require("colors");

const Feature = require("../models/feature");
const AdminUnit = require("../models/adminUnit");

module.exports = {
  getCommuneGeoJSON: function (communeBFSnum, callback) {
    request
      .get(
        "http://api3.geo.admin.ch/rest/services/api/MapServer/ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill/" + communeBFSnum + "?geometryFormat=geojson&sr=2056"
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
