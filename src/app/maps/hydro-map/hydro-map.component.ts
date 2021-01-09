import { Component, OnInit, OnDestroy } from '@angular/core';

import { Map } from 'ol';
import { Subscription } from 'rxjs';

import { MapsService } from '../maps.service';
import { FeaturesService } from '../../features/features.service';
import { Feature } from '../../features/feature.model';

@Component({
  selector: 'app-hydro-map',
  templateUrl: 'hydro-map.component.html',
  styleUrls: ['hydro-map.component.css'],
})
export class HydroMapComponent implements OnInit, OnDestroy {
  Map: Map;
  viewCenter: number[];
  viewResolution: number;
  features: Feature[] = [];
  private featuresListSub: Subscription;

  layerConfigHydro = {
    layerType: "WMTS",
    description: 'VECTOR25 Réseau hydrographique GWN07',
    layerName: 'ch.swisstopo.vec25-gewaessernetz_referenz',
    capabilitiesUrl:
      'https://wmts.geo.admin.ch/EPSG/2056/1.0.0/WMTSCapabilities.xml',
    epsgProjCode: 'EPSG:2056',
    p4jDef:
      '"EPSG:2056","+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs"',
    extent: [2420000, 130000, 2900000, 1350000],
    matrixSet: '2056_27',
    sourceUrl:
      'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.vec25-gewaessernetz_referenz/default/current/2056/{TileMatrix}/{TileCol}/{TileRow}.png',
    attribution: [
      {
        attrURL:
          'https://www.geocat.ch/geonetwork/srv/ger/catalog.search#/metadata/0351bc2e-3cdc-4e8a-b422-0142e494e7b4',
        attrTitle: 'VECTOR25 Réseau hydrographique GWN07',
      },
      {
        attrURL: 'https://www.swisstopo.admin.ch/',
        attrTitle: 'Office fédéral de topographie',
      },
      {
        attrURL: 'https://www.geo.admin.ch/',
        attrTitle: 'geo.admin.ch',
      },
    ],
  };

  layerConfigGrau = {
    layerType: "WMTS",
    layerName: 'ch.swisstopo.pixelkarte-grau',
    description: 'Landeskarten (grau)',
    capabilitiesUrl:
      'https://wmts.geo.admin.ch/EPSG/2056/1.0.0/WMTSCapabilities.xml',
    epsgProjCode: 'EPSG:2056',
    p4jDef:
      '"EPSG:2056","+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs"',
    extent: [2420000, 130000, 2900000, 1350000],
    matrixSet: '2056_27',
    sourceUrl:
      'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/2056/{TileMatrix}/{TileCol}/{TileRow}.jpeg',
    attribution: [
      {
        attrURL:
          'https://www.geocat.ch/geonetwork/srv/ger/md.viewer#/full_view/74aef814-0c97-4261-a2c1-df4a948aca8e',
        attrTitle: 'Landeskarten (grau)',
      },
      {
        attrURL: 'https://www.swisstopo.admin.ch/',
        attrTitle: 'Office fédéral de topographie',
      },
      {
        attrURL: 'https://www.geo.admin.ch/',
        attrTitle: 'geo.admin.ch',
      },
    ],
  };

  constructor(
    public featuresService: FeaturesService,
    public mapsService: MapsService
  ) {}

  ngOnInit(): void {
    this.featuresService.getFeatures();
    this.featuresListSub = this.featuresService
      .getFeatureUpdateListener()
      .subscribe((features: Feature[]) => {
        const featuresSelected = features.filter(
          (feature) => feature.selected == true
        );
        if (!this.Map) {
          this.viewCenter = [2573902.1157, 1198145.9932]
          this.viewResolution = 50;
          this.Map = this.mapsService.initMap(this.layerConfigGrau, this.viewCenter, this.viewResolution);
          this.Map.addLayer(
            this.mapsService.getSelectedCommunesLayer(featuresSelected)
          );
        } else {
          this.Map.dispose();
          this.Map = this.mapsService.initMap(this.layerConfigGrau, this.viewCenter, this.viewResolution);
          this.Map.addLayer(
            this.mapsService.getSelectedCommunesLayer(featuresSelected)
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.featuresListSub.unsubscribe();
  }
}
