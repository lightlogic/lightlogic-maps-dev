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
import {register} from 'ol/proj/proj4';

import { Feature } from '../features/feature.model';

@Injectable({ providedIn: 'root' })
export class MapsService {
  initMap() {
    proj4.defs("EPSG:2056","+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs");
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
    //EPSG:3857
    //const myExtent: olExtent.Extent = [5.140242, 45.398181, 11.47757, 48.230651];
    //EPSG:2056
    const myExtent: olExtent.Extent = [2420000, 130000, 2900000, 1350000];
    const myProjection: Projection = olProj.get('EPSG:2056');
    myProjection.setExtent(myExtent);

    // view
    const myView = new View({
      center: [2573902.1157, 1198145.9932],
      projection: myProjection,
      resolution: 750,
      //zoom: 15,
      //maxZoom: 19,
      //minZoom: 2,
      //center: [902568.5270415349, 5969980.338127118],
      //center: [46.94078, 7.09297],
    });
    // Map object
    const myMap = new Map({
      view: myView,
      target: 'map',
    });

    // Base Layers
    // Openstreet Map Standard
    const openstreetMapStandard = new Tile({
      source: new OSM(),
      visible: true,
      zIndex: 0,
    });
    //myMap.addLayer(openstreetMapStandard);

    var myMatrixIds = [];
    for (var i = 0; i < RESOLUTIONS.length; i++) {
      myMatrixIds.push(i);
    }

    const myTileGrid = new WMTStileGrid({
      origin: [myExtent[0], myExtent[3]],
      resolutions: RESOLUTIONS,
      matrixIds: myMatrixIds,
    });
    const swisstopoLayer = new Tile({
      source: new WMTSSource({
        url:
          'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.vec25-gewaessernetz_referenz/default/current/2056/{TileMatrix}/{TileCol}/{TileRow}.png',
        tileGrid: myTileGrid,
        projection: myProjection,
        layer: 'ch.swisstopo.vec25-gewaessernetz_referenz',
        requestEncoding: 'REST',
        style: 'default',
        matrixSet: '2056_27',
      }),
    });
    myMap.addLayer(swisstopoLayer);
    return myMap;
  }

  getSelectedCommunesLayer<LayerVector>(featuresSelected: Feature[]) {
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
          featureProjection: 'EPSG:3857', // projection of Map and View
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
