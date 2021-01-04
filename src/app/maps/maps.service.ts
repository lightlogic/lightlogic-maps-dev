import { Injectable } from '@angular/core';
import { Map, View } from 'ol';
import { Vector as LayerVector, Tile } from 'ol/layer';
import { Vector as SourceVector, OSM } from 'ol/source';
import { WKT } from 'ol/format';

import { Feature } from '../features/feature.model';

@Injectable({ providedIn: 'root' })
export class MapsService {
  initMap() {
    // view
    const myView = new View({
      zoom: 13,
      center: [790060.1994068121, 5935536.331790512],
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
    myMap.addLayer(openstreetMapStandard);
    return myMap;
  }

  getSelectedCommunesLayer<LayerVector>(featuresSelected: Feature[]) {
    let communesLimitsWKT: string[] = [];

    featuresSelected.forEach((selFeature) => {
      communesLimitsWKT.push(selFeature.wktGeometry);
    });

    let format = new WKT();
    let communesFeatures = [];
    communesLimitsWKT.forEach((wktgeometry) => {
      communesFeatures.push(
        format.readFeature(wktgeometry, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
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
