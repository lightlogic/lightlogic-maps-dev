const request = require("superagent");
const colors = require("colors");

// Module fetching data from http://api3.geo.admin.ch/services/sdiservices.html#feature-resource
// Feature Resource
// With an ID (or several in a comma separated list) and a layer ID (technical name),
// this service can be used to retrieve a feature resource.
module.exports = {
  getCommuneGeoJSON: function (communeBFSnum, callback) {
    API_URL = "https://api3.geo.admin.ch/rest/services/api/MapServer/";
    LAYER_ID = "ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill";
    PROJECTION = "2056";

    const queryURL =
      API_URL +
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
    API_URL = "https://api3.geo.admin.ch/rest/services/api/MapServer/find";
    SEARCH_FIELD = "gewissnr";
    reqURL =
      API_URL +
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
