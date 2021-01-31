import { Component, OnInit, OnDestroy } from '@angular/core';

import { Map } from 'ol';
import { Subscription } from 'rxjs';

import { MapsService } from '../maps.service';
import { FeaturesService } from '../../features/features.service';
import { Feature } from '../../features/feature.model';

import { environment } from '../../../environments/environment';

import layerConf_GewaessernetzReferenz from '../layerConfig/geo.admin.ch/ch_swisstopo_vec25_gewaessernetz_referenz.json';
import layerConf_LandeskartenGrau from '../layerConfig/geo.admin.ch/ch_swisstopo_pixelkarte_grau.json';

const MAPRESOLUTION_TWEAKCONSTANT = environment.mapResolution_tweakConstant;

@Component({
  selector: 'app-hydro-map',
  templateUrl: 'geomap.component.html',
  styleUrls: ['geomap.component.css'],
})
export class HydroMapComponent implements OnInit, OnDestroy {
  Map: Map;
  viewCenter: number[] = [0, 0];
  viewResolution: number;
  viewBBOX: Array<number> = [2999999, 1999999, 2000000, 1000000];
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
        featuresSelected.forEach((oneFeature) => {
          var bboxArray: Array<number>;
          bboxArray = oneFeature.bbox;
          this.viewBBOX[0] = Math.min(bboxArray[0], this.viewBBOX[0]);
          this.viewBBOX[1] = Math.min(bboxArray[1], this.viewBBOX[1]);
          this.viewBBOX[2] = Math.max(bboxArray[2], this.viewBBOX[2]);
          this.viewBBOX[3] = Math.max(bboxArray[3], this.viewBBOX[3]);
        });
        this.viewCenter[0] = Math.round(
          (this.viewBBOX[0] + this.viewBBOX[2]) / 2
        );
        this.viewCenter[1] = Math.round(
          (this.viewBBOX[1] + this.viewBBOX[3]) / 2
        );
        this.viewResolution = Math.round(
          Math.max(this.viewBBOX[2] - this.viewBBOX[0]) /
            MAPRESOLUTION_TWEAKCONSTANT
        );
        console.log('View Resolution: ' + this.viewResolution);
        if (!this.Map) {
          this.Map = this.mapsService.initMap(
            layerConf_LandeskartenGrau,
            this.viewCenter,
            this.viewResolution
          );
          this.Map.addLayer(
            this.mapsService.getSelectedCommunesLayer(featuresSelected)
          );
        } else {
          this.Map.dispose();
          this.Map = this.mapsService.initMap(
            layerConf_LandeskartenGrau,
            this.viewCenter,
            this.viewResolution
          );
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
