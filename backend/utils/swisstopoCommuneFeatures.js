const request = require("superagent");

const Feature = require("../models/feature");

const getSwisstopoCommuneFeature = (communeName, callback) => {
  const swisstopoCommuneQueryTemplate =
    "query=PREFIX+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E%0APREFIX+geo%3A+%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23%3E%0APREFIX+gn%3A+%3Chttp%3A%2F%2Fwww.geonames.org%2Fontology%23%3E%0A%0ASELECT+%3FCommune+%3FName+%3FWKT%0AWHERE+%7B%0A%3FCommune+gn%3AfeatureCode+gn%3AA.ADM3+.%0A%3FCommune+schema%3Aname+%22COMMUNEPLACEHOLDER%22+.%0A%3FCommune+geo%3AdefaultGeometry+%3FGeometry+.%0A%3FGeometry+geo%3AasWKT+%3FWKT+.%0A%3FCommune+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fissued%3E+%3FDate+.%0AFILTER+(%3FDate+%3D+%222020-01-01%22%5E%5Exsd%3Adate)%0A%7D";
  const stpQuery = swisstopoCommuneQueryTemplate.replace(
    "COMMUNEPLACEHOLDER",
    communeName
  );
  request
    .post("https://ld.geo.admin.ch/query")
    .send(stpQuery)
    .set("Accept", "application/sparql-results+json")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .end((err, res) => {
      if (err) {
        callback(err);
      } else if (res.body.results.bindings.length == 1) {
        const swisstopoFeature = new Feature({
          id: 1,
          uri: res.body.results.bindings[0].Commune.value,
          description: communeName,
          wktGeometry: res.body.results.bindings[0].WKT.value,
          projection: "EPSG:3857",
        });
        callback(undefined, swisstopoFeature);
      }
    });
};

module.exports = getSwisstopoCommuneFeature;
