import { Injectable } from '@angular/core';
import { Map, View } from 'ol';
import Projection from 'ol/proj/Projection';
import * as olProj from 'ol/proj';
import * as olExtent from 'ol/extent';
import { Vector as LayerVector, Tile } from 'ol/layer';
import { Vector as SourceVector, OSM } from 'ol/source';
import { WMTS as WMTSSource } from 'ol/source';
import WMTStileGrid from 'ol/tilegrid/WMTS';
import { WKT } from 'ol/format';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

import { Feature } from '../features/feature.model';
import Control from 'ol/control/Control';

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
        //TODO attribution not working. See Udemy approach
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
    let communesLimitsWKT = [];

    featuresSelected.forEach((feature) => {
      communesLimitsWKT.push({
        wktGeom: feature.wktGeometry,
        featureProj: feature.projection,
      });
    });

    let format = new WKT();
    let communesFeatures = [];
    communesLimitsWKT.forEach((feature) => {
      communesFeatures.push(
        format.readFeature(feature.wktGeom, {
          dataProjection: 'EPSG:4326', // projection of WKT data
          featureProjection: 'EPSG:2058', // projection of Map and View
        })
      );
    });

    const communesVector = new LayerVector({
      source: new SourceVector({
        features: communesFeatures,
      }),
      visible: true,
      zIndex: 1,
    });

    return communesVector;
  }
}
