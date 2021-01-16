const colors = require("colors");
const cloneextend = require("cloneextend");

const GeoEntity = require("../../models/geoEntity");
const dataWikidataUtils = require("../3rdPartyData/data-wikidata-utils");
const geodataAPIGeoAdminUtils = require("../3rdPartyData/geodata-APIGeoAdmin-utils");
const geodataLDGeoAdminUtils = require("../3rdPartyData/geodata-LDGeoAdmin-utils");

// Module fetching data from https://query.wikidata.org/
module.exports = {
  createGeoEntity: function (
    geoEntityName,
    geoEntityType,
    geIsA,
    _domainIdLabel,
    callback
  ) {
    newGeoEntity = new GeoEntity();
    newGeoEntity.isA = geIsA;
    if (geoEntityType == "river") {
      dataWikidataUtils.getWikidataRiver(
        geoEntityName,
        (cerror, entityData) => {
          if (cerror) {
            console.log(colors.red(cerror));
          } else {
            const gewissNum_int = entityData.gewissNum.value.replace("CH/", "");
            newGeoEntity = new GeoEntity({
              uri: entityData.uri.value,
              isA: geIsA,
              domainId: gewissNum_int,
              domainIdLabel: _domainIdLabel,
              description: geoEntityName,
              parentUri: null,
              parentLabel: null,
            });
            callback(undefined, newGeoEntity);
          }
        }
      );
    } else if (geoEntityType == "commune") {
      geodataLDGeoAdminUtils.getBFScommuneData(
        geoEntityName,
        (cerror, entityData) => {
          if (cerror) {
            console.log(colors.red(cerror));
          } else {
            newGeoEntity = new GeoEntity({
              uri: entityData.communeUri.value,
              isA: geIsA,
              domainId: entityData.bfsNum.value,
              domainIdLabel: _domainIdLabel,
              description: entityData.communeName.value,
              parentUri: entityData.cantonUri.value,
              parentLabel: entityData.cantonName.value,
            });
            callback(undefined, newGeoEntity);
          }
        }
      );
    } else {
      console.log(colors.red("geoEntity Type not found."));
    }
  },
  fetchGeoJson: function (geoEntity, layerBodId, callback) {
    // geoEntity is a river
    if (geoEntity.isA == "https://www.wikidata.org/wiki/Q4022") {
      geodataAPIGeoAdminUtils.getRiverGeoJSON(
        geoEntity.domainId,
        layerBodId,
        (cerror, entityGeoJSON) => {
          if (cerror) {
            console.log(colors.red(cerror));
          } else {
            geoEntityComplete = cloneextend.clone(geoEntity);
            geoEntityComplete.geoJSON = entityGeoJSON;
            callback(undefined, geoEntityComplete);
          }
        }
      );
      // geoEntity is a commune
    } else if (geoEntity.isA == "http://www.geonames.org/ontology#A.ADM3") {
      geodataAPIGeoAdminUtils.getCommuneGeoJSON(
        geoEntity.domainId,
        (cerror, entityGeoJSON) => {
          if (cerror) {
            console.log(colors.red(cerror));
          } else {
            geoEntityComplete = cloneextend.clone(geoEntity);
            geoEntityComplete.geoJSON = entityGeoJSON;
            callback(undefined, geoEntityComplete);
          }
        }
      );
    } else {
      console.log(colors.red("geoEntity Type not found."));
    }
  },
};
