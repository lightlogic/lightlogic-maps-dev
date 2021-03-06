const request = require("superagent");
const colors = require("colors");

const GEOADMIN_API_URL =
  "https://api3.geo.admin.ch/rest/services/api/MapServer/";

// Module fetching data from http://api3.geo.admin.ch/services/sdiservices.html#feature-resource
// Feature Resource
// With an ID (or several in a comma separated list) and a layer ID (technical name),
// this service can be used to retrieve a feature resource.

//TODO #23 error handling when fetching data from api3.geo.admin.ch
module.exports = {
  getCommuneGeoJSON: function (communeBFSnum, callback) {
    LAYER_ID = "ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill";
    PROJECTION = "2056";

    const queryURL =
      GEOADMIN_API_URL +
      LAYER_ID +
      "/" +
      communeBFSnum +
      "?geometryFormat=geojson&sr=" +
      PROJECTION;
    request.get(queryURL).end((err, res) => {
      if (err) {
        callback(err);
      } else {
        callback(undefined, res.body.feature);
      }
    });
  },
  getRiverGeoJSON: function (gewaessNum, layerBodId, callback) {
    SEARCH_FIELD = "gewissnr";
    reqURL =
      GEOADMIN_API_URL +
      "find" +
      "?layer=" +
      layerBodId +
      "&searchText=" +
      gewaessNum +
      "&searchField=" +
      SEARCH_FIELD +
      "&returnGeometry=true&geometryFormat=geojson&sr=2056&lang=fr";
    request
      .get(reqURL)
      .accept("json")
      .end((err, res) => {
        if (err) {
          callback(err);
        } else {
          callback(undefined, res.body);
        }
      });
  },
};
