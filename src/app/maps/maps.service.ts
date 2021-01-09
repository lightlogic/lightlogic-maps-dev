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
import { GeoJSON } from 'ol/format';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

import { Feature } from '../features/feature.model';
import Control from 'ol/control/Control';
import VectorSource from 'ol/source/Vector';

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

    // featuresSelected.forEach((feature) => {
    //   communesLimitsWKT.push({
    //     wktGeom: feature.wktGeometry,
    //     featureProj: feature.projection,
    //   });
    // });
    const geoJsonString = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:2058',
        },
      },
      features: [
        {
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [2572961.9, 1197774.0],
                  [2573747.8, 1196703.3],
                  [2573756.5, 1196615.2],
                  [2573776.5, 1196575.5],
                  [2573869.7, 1196380.4],
                  [2573882.0, 1196357.4],
                  [2573926.6, 1196257.8],
                  [2573962.9, 1196179.7],
                  [2573995.5, 1196103.9],
                  [2573999.1, 1196083.3],
                  [2573996.9, 1196056.9],
                  [2573994.7, 1196009.7],
                  [2574001.8, 1195918.2],
                  [2573992.4, 1195865.1],
                  [2573994.6, 1195818.7],
                  [2574009.1, 1195748.7],
                  [2574015.7, 1195738.8],
                  [2574030.0, 1195737.9],
                  [2574045.1, 1195735.0],
                  [2574115.6, 1195687.5],
                  [2574123.9, 1195680.2],
                  [2574147.2, 1195647.1],
                  [2574155.2, 1195642.8],
                  [2574156.1, 1195638.2],
                  [2574157.5, 1195636.0],
                  [2574032.9, 1195554.6],
                  [2573860.2, 1195533.2],
                  [2573791.4, 1195412.0],
                  [2573781.6, 1195365.6],
                  [2573440.9, 1195236.5],
                  [2573307.6, 1195373.1],
                  [2573191.2, 1195529.8],
                  [2573094.9, 1195697.7],
                  [2573068.0, 1195739.8],
                  [2573058.6, 1195755.5],
                  [2573021.5, 1195808.4],
                  [2572995.9, 1195845.1],
                  [2572089.4, 1197133.6],
                  [2572961.9, 1197774.0],
                ],
              ],
            ],
          },
          layerBodId: 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
          bbox: [2572089.4, 1195236.5, 2574157.5, 1197774.0],
          featureId: 2261,
          layerName: 'Limites de commune',
          type: 'Feature',
          id: 2261,
          properties: {
            perimeter: 6822.83221006627,
            gemflaeche: 247.0,
            label: 'Greng',
            objektart: 0,
            kanton: 'FR',
            gemname: 'Greng',
          },
        },
        {
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [2573321.3, 1198037.8],
                  [2574122.7, 1198626.1],
                  [2574957.5, 1197488.9],
                  [2575032.6, 1197349.7],
                  [2575002.0, 1197324.5],
                  [2575037.3, 1197281.6],
                  [2575038.6, 1197272.4],
                  [2575043.8, 1197266.8],
                  [2575060.1, 1197236.3],
                  [2575067.4, 1197219.2],
                  [2575086.4, 1197184.3],
                  [2575118.8, 1197128.0],
                  [2575150.1, 1197071.7],
                  [2575144.2, 1197064.2],
                  [2575139.1, 1197056.0],
                  [2575129.1, 1197038.2],
                  [2575119.8, 1197017.0],
                  [2575106.0, 1196983.6],
                  [2575107.9, 1196989.7],
                  [2575107.7, 1196993.2],
                  [2575105.3, 1196995.8],
                  [2575101.7, 1196996.1],
                  [2575071.7, 1196990.8],
                  [2575068.3, 1196967.5],
                  [2574991.3, 1196915.0],
                  [2574924.4, 1196864.6],
                  [2574875.1, 1196836.1],
                  [2574650.4, 1196668.2],
                  [2574604.2, 1196629.5],
                  [2574557.3, 1196590.9],
                  [2574512.9, 1196550.7],
                  [2574487.4, 1196525.9],
                  [2574482.3, 1196521.3],
                  [2574366.7, 1196658.9],
                  [2574360.6, 1196654.4],
                  [2574352.5, 1196664.0],
                  [2574336.5, 1196650.7],
                  [2574321.3, 1196665.7],
                  [2574338.0, 1196677.7],
                  [2574329.2, 1196691.2],
                  [2574320.0, 1196703.0],
                  [2574197.9, 1196843.6],
                  [2573321.3, 1198037.8],
                ],
              ],
            ],
          },
          layerBodId: 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
          bbox: [2573321.3, 1196521.3, 2575150.1, 1198626.1],
          featureId: 2271,
          layerName: 'Limites de commune',
          type: 'Feature',
          id: 2271,
          properties: {
            perimeter: 5766.27165301696,
            gemflaeche: 185.0,
            label: 'Meyriez',
            objektart: 0,
            kanton: 'FR',
            gemname: 'Meyriez',
          },
        },
      ],
    };

    // let format = new GeoJSON();
    // format.readFeature(geoJsonString, {
    //   dataProjection: 'EPSG:2058', // projection of WKT data
    //   featureProjection: 'EPSG:2058', // projection of Map and View
    // });

    var myVsource = new VectorSource({
      features: new GeoJSON().readFeatures(geoJsonString),
    });
    // console.log(geoJsonString);
    // const myFeature = format.readFeature(geoJsonString, {
    //   dataProjection: 'EPSG:2058', // projection of WKT data
    //   featureProjection: 'EPSG:2058', // projection of Map and View
    // });
    // let format = new WKT();
    // let communesFeatures = [];
    // communesLimitsWKT.forEach((feature) => {
    //   communesFeatures.push(
    //     format.readFeature(feature.wktGeom, {
    //       dataProjection: 'EPSG:4326', // projection of WKT data
    //       featureProjection: 'EPSG:2058', // projection of Map and View
    //     })
    //   );
    // });

    const communesVector = new LayerVector({
      source: myVsource,
      visible: true,
      zIndex: 1,
    });

    return communesVector;
  }
}
