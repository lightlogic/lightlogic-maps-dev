const request = require("superagent");
const colors = require("colors");

const GeoEntity = require("../../models/geoEntity");

// Module fetching data from https://query.wikidata.org/
module.exports = {
  getWikidataRiver: function (riverName, callback) {
    //TODO move constant to env file
    WIKIDATA_SPARQL_EP = "https://query.wikidata.org/sparql";
    SPARQLQUERY_TEMPLATE =
      "query=SELECT%20%3Furi%20%3FgewissNum%20WHERE%7B%3Furi%20wdt%3AP31%20wd%3AQ4022%3Bwdt%3AP17%20wd%3AQ39%3B%3Flabel%22RIVERPLACEHOLDER%22%40fr.%3Furi%20wdt%3AP1183%20%3FgewissNum.%7D%0A";
    const riverQuery = SPARQLQUERY_TEMPLATE.replace(
      "RIVERPLACEHOLDER",
      riverName
    );
    request
      .post(WIKIDATA_SPARQL_EP)
      .send(riverQuery)
      .set(
        "User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
      )
      .set("Accept", "application/sparql-results+json")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .end((err, res) => {
        if (err) {
          console.log(colors.magenta(riverQuery));
          callback(err);
        } else if (res.body.results.bindings.length == 1) {
          // const gewissNum_int = res.body.results.bindings[0].gewissNum.value.replace(
          //   "CH/",
          //   ""
          // );
          // const riverRes = new GeoEntity({
          //   uri: res.body.results.bindings[0].uri.value,
          //   domainId: gewissNum_int,
          //   domainIdLabel: RIVER_DOMAIN_LABEL,
          //   isA: RIVER_TYPE_URI,
          //   description: riverName,
          //   parentUri: null,
          //   parentLabel: null
          // });
          callback(undefined, res.body.results.bindings[0]);
          //console.log(colors.magenta(res.body.results.bindings[0]));
        }
      });
  },
};
