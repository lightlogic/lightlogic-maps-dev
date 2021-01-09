const request = require("superagent");
const colors = require("colors");

const Feature = require("../models/feature");

//

const getSwisstopoCommuneFeature = (communeName, callback) => {
  request
    .get("http://api3.geo.admin.ch/rest/services/api/MapServer/ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill/2271?geometryFormat=geojson&sr=2056")
    .end((err, res) => {
      if (err) {
        callback(err);
      } else {
    //       console.log(colors.magenta(res.body))
    //      const swisstopoFeature = new Feature({
    // //       id: 1,
    //          uri: res.body.feature.featureId,
    //          description: res.body.feature.properties.label,
    // //       wktGeometry: res.body.results.bindings[0].WKT.value,
    //          projection: "EPSG:2058",
    //        selected: false,
    //     });
    //    callback(undefined, swisstopoFeature);
    callback(undefined, res.body.feature);
    //   }
      };
    })
  };

module.exports = getSwisstopoCommuneFeature;
