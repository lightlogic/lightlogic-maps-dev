import { Injectable } from '@angular/core';
import { Map, View } from 'ol';
import Projection from 'ol/proj/Projection';
import * as olProj from 'ol/proj';
import * as olExtent from 'ol/extent';
import { Vector as LayerVector, Tile } from 'ol/layer';
import { Vector as SourceVector, OSM } from 'ol/source';
import { WMTS as WMTSSource } from 'ol/source';
import WMTStileGrid from 'ol/tilegrid/WMTS';
import { GeoJSON } from 'ol/format';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

import { Feature } from '../features/feature.model';

@Injectable({ providedIn: 'root' })
export class MapsService {
  initMap(layerConfig, vCenter, vResolution) {
    // Proj4js is a JavaScript library to transform point coordinates from one coordinate system to another
    // https://github.com/proj4js/proj4js
    proj4.defs(
      'EPSG:2056',
      '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs'
    );
    register(proj4);
    const RESOLUTIONS = [
      4000,
      3750,
      3500,
      3250,
      3000,
      2750,
      2500,
      2250,
      2000,
      1750,
      1500,
      1250,
      1000,
      750,
      650,
      500,
      250,
      100,
      50,
      20,
      10,
      5,
      2.5,
      2,
      1.5,
      1,
      0.5,
    ];
    var myMatrixIds = [];
    for (var i = 0; i < RESOLUTIONS.length; i++) {
      myMatrixIds.push(i);
    }

    //EPSG:2056
    const mExtent: olExtent.Extent = layerConfig.extent;
    const epsgProjection: Projection = olProj.get(layerConfig.epsgProjCode);
    epsgProjection.setExtent(mExtent);

    // view
    const myView = new View({
      center: vCenter,
      projection: epsgProjection,
      resolution: vResolution,
    });
    // Map object
    const myMap = new Map({
      view: myView,
      target: 'map',
    });

    let attrArray: string[] = [];
    attrArray.push(
      layerConfig.attribution.forEach((attrElement) => {
        const aText =
          '<a href="' +
          attrElement.attrURL +
          '" target="_blank">' +
          attrElement.attrTitle +
          '</a>';
      })
    );
    let attrString = attrArray.join(' ');

    const myTileGrid = new WMTStileGrid({
      origin: [mExtent[0], mExtent[3]],
      resolutions: RESOLUTIONS,
      matrixIds: myMatrixIds,
    });
    const baseMapLayer = new Tile({
      source: new WMTSSource({
        url: layerConfig.sourceUrl,
        tileGrid: myTileGrid,
        projection: layerConfig.epsgProjCode,
        layer: layerConfig.layerName,
        requestEncoding: 'REST',
        style: 'default',
        matrixSet: layerConfig.matrixSet,
        //TODO attribution not working. ? See Udemy approach
        attributions: attrString,
      }),
    });
    myMap.addLayer(baseMapLayer);
    return myMap;
  }

  getSelectedCommunesLayer<LayerVector>(featuresSelected: Feature[]) {
    proj4.defs(
      'EPSG:2056',
      '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs'
    );
    register(proj4);

    // From https://stackoverflow.com/questions/49925035/openlayers-4-vector-append-new-features-but-without-clearing-others
    // You almost got it. vectorSource.addFeature(feature); is the correct method. However, it only accepts ol.Feature objects, not raw data. The format option of the VectorSource only applies to loading via url, it is not used for addFeatures.
    // But transforming the data to features is easy:
    // var feature = new ol.format.GeoJSON()({ featureProjection: 'EPSG:3857' }).readFeature(data));
    // vectorSource.addFeatures(feature);
    //  or for multiple features
    // var features = new ol.format.GeoJSON()({ featureProjection: 'EPSG:3857' }).readFeatures(data));
    // vectorSource.addFeaturess(features);

    // bad and dirty way to concat features selected geoJSON into one "collection"

    // methode:
    // each feature (backend: geoEntity objects in DB) has an array of geoJSON object
    // therefor nested foreach get every selected feature
    // and adds each its geoJSON objects to the FeatureCollection
    // typically Commune has only one, and river can have many geoJSON parts
    var featuresGeoJSON = '{"type": "FeatureCollection", "features": [';
    featuresSelected.forEach((feature) => {
      feature.geoJSON.forEach((featureElement) => {
        featuresGeoJSON =
          featuresGeoJSON + JSON.stringify(featureElement) + ',';
      });
    });

    featuresGeoJSON = featuresGeoJSON.slice(0, -1);
    featuresGeoJSON = featuresGeoJSON.concat(']}');
    console.log(featuresGeoJSON);

    var myVsource = new SourceVector({
      features: new GeoJSON().readFeatures(featuresGeoJSON),
    });

    const communesVector = new LayerVector({
      source: myVsource,
      visible: true,
      zIndex: 1,
    });

    return communesVector;
  }
}
