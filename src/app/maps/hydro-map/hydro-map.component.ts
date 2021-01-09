import { Component, OnInit, OnDestroy } from '@angular/core';

import { Map } from 'ol';
import { Subscription } from 'rxjs';

import { MapsService } from '../maps.service';
import { FeaturesService } from '../../features/features.service';
import { Feature } from '../../features/feature.model';

import layerConf_GewaessernetzReferenz from '../layerConfig/geo.admin.ch/ch_swisstopo_vec25_gewaessernetz_referenz.json';
import layerConf_LandeskartenGrau from '../layerConfig/geo.admin.ch/ch_swisstopo_pixelkarte_grau.json';
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
          this.Map = this.mapsService.initMap(layerConf_LandeskartenGrau, this.viewCenter, this.viewResolution);
          this.Map.addLayer(
            this.mapsService.getSelectedCommunesLayer(featuresSelected)
          );
        } else {
          this.Map.dispose();
          this.Map = this.mapsService.initMap(layerConf_LandeskartenGrau, this.viewCenter, this.viewResolution);
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
