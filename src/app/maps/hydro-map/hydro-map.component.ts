import {
  Component,
  AfterViewInit,
  NgZone,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { Map, View } from 'ol';
import { Vector as LayerVector, Tile } from 'ol/layer';
import { Vector as SourceVector, OSM } from 'ol/source';
import { WKT } from 'ol/format';
import { Subscription } from 'rxjs';

import { FeaturesService } from '../../features/features.service';
import { Feature } from '../../features/feature.model';
@Component({
  selector: 'app-hydro-map',
  templateUrl: 'hydro-map.component.html',
  styleUrls: ['hydro-map.component.css'],
})
export class HydroMapComponent implements OnInit, OnDestroy, AfterViewInit {
  view: View;
  Map: Map;
  communesLimitsWKT: String[] = [];
  @Output() mapReady = new EventEmitter<Map>();
  features: Feature[] = [];
  private featuresListSub: Subscription;

  constructor(private zone: NgZone, public featuresService: FeaturesService) {}

  ngOnInit(): void {
    this.featuresService.getFeatures();
    this.featuresListSub = this.featuresService
      .getFeatureUpdateListener()
      .subscribe((features: Feature[]) => {
        const featuresSelected = features.filter(
          (feature) => feature.selected == true
        );
        this.communesLimitsWKT = [];
        featuresSelected.forEach((selFeature) => {
          this.communesLimitsWKT.push(selFeature.wktGeometry);
        });
        this.initMap();
      });
  }

  ngAfterViewInit(): void {
    // if (!this.Map) {
    //   this.zone.runOutsideAngular(() => this.initMap());
    // }
    // setTimeout(() => this.mapReady.emit(this.Map));
  }

  initMap() {
    // view
    this.view = new View({
      zoom: 13,
      center: [790060.1994068121, 5935536.331790512],
    });
    // Map object
    this.Map = new Map({
      view: this.view,
      target: 'map',
    });

    // Base Layers
    // Openstreet Map Standard
    const openstreetMapStandard = new Tile({
      source: new OSM(),
      visible: true,
      zIndex: 0,
    });
    this.Map.addLayer(openstreetMapStandard);

    let format = new WKT();
    let communesFeatures = [];
    this.communesLimitsWKT.forEach((wktgeometry) => {
      communesFeatures.push(
        format.readFeature(wktgeometry, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        })
      );
    });

    var communesVector = new LayerVector({
      source: new SourceVector({
        features: communesFeatures,
      }),
      visible: true,
      zIndex: 1,
    });
    this.Map.addLayer(communesVector);

    // map.on("click", function (e) {
    //   console.log(e.coordinate);
    // });
  }
  ngOnDestroy(): void {
    this.featuresListSub.unsubscribe();
  }
}
