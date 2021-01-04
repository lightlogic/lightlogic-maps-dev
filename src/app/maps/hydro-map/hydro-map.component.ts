import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';

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
          this.Map = this.mapsService.initMap();
          this.Map.addLayer(this.mapsService.getSelectedCommunesLayer(featuresSelected));
        } else {
          this.Map.dispose();
          this.Map = this.mapsService.initMap();
          this.Map.addLayer(this.mapsService.getSelectedCommunesLayer(featuresSelected));
        }
      });
  }

  ngOnDestroy(): void {
    this.featuresListSub.unsubscribe();
  }
}
