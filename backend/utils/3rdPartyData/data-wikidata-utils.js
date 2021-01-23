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
          console.log(colors.red(riverQuery));
          callback(err);
        } else if (res.body.results.bindings.length == 1) {
          callback(undefined, res.body.results.bindings[0]);
        }
      });
  },
  getWikidataCHrivers: function (noValue, callback) {
    //TODO move constant to env file
    WIKIDATA_SPARQL_EP = "https://query.wikidata.org/sparql";
    const riverQuery = "query=SELECT%3FriverLabel%20WHERE%7B%3Friver%20wdt%3AP31%20wd%3AQ4022%3Bwdt%3AP17%20wd%3AQ39%3B%20wdt%3AP2043%3Flength%20SERVICE%20wikibase%3Alabel%7Bbd%3AserviceParam%20wikibase%3Alanguage%22en%2Cfr%22.%7D%7DORDER%20BY%20DESC(%3Flength)";
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
          console.log(colors.red(riverQuery));
          callback(err);
        } else if (res.body.results.bindings.length > 1) {
          callback(undefined, res.body.results.bindings);
        }
      });
  },
};
