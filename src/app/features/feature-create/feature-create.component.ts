import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Feature } from '../feature.model';

import { FeaturesService } from '../features.service';

@Component({
  selector: 'app-feature-create',
  templateUrl: './feature-create.component.html',
  styleUrls: ['./feature-create.component.css'],
})
export class FeatureCreateComponent implements OnInit, OnDestroy {
  communeForm: FormGroup;
  featureForm: FormGroup;
  isCommuneLoading = false;
  private featureId: string;
  private featureData: Feature;
  private swisstopoSearchStatusSub: Subscription;

  constructor(public featuresService: FeaturesService) {}

  ngOnInit() {
    this.featureId = null;
    // Commune Form
    this.communeForm = new FormGroup({
      communeName: new FormControl(null),
    });
    // Feature Form
    this.featureForm = new FormGroup({
      uri: new FormControl(null),
      description: new FormControl(null),
      wktGeometry: new FormControl(null),
      projection: new FormControl('EPSG:3857'),
    });
  }

  onAddFeature() {
    this.featuresService.addCustomFeature(
      this.featureId,
      this.featureForm.value.uri,
      this.featureForm.value.description,
      this.featureForm.value.wktGeometry,
      this.featureForm.value.projection
    );
    this.featureForm.reset;
  }

  onAddCommune() {
    this.isCommuneLoading = true;
    this.featuresService.addSwisstopoFeature(
      this.communeForm.value.communeName
    );
    this.swisstopoSearchStatusSub = this.featuresService
      .getSwisstopoSearchListener()
      .subscribe((subsFeature) => {
        if (subsFeature.success) {
          this.featureData = subsFeature.feature;
          //TODO #6
          // plus nécessaire this.featureData.description = this.communeForm.value.communeName
          this.communeForm.reset();
          this.isCommuneLoading = false;
          console.log(subsFeature.message);
          console.log(this.featureData);
        } else {
          console.log(subsFeature.message);
          this.isCommuneLoading = false;
        }
      });
  }
  ngOnDestroy() {
    this.swisstopoSearchStatusSub.unsubscribe();
  }
}
