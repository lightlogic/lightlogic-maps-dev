import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { FeaturesService } from '../features.service';

@Component({
  selector: 'app-feature-create',
  templateUrl: './feature-create.component.html',
  styleUrls: ['./feature-create.component.css'],
})
export class FeatureCreateComponent implements OnInit {
  communeForm: FormGroup;
  featureForm: FormGroup;
  isCommuneLoading = false;
  private featureId: string;

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
      this.featureForm.value.projection,
      false // default value for "selected"
    );
    this.featureForm.reset;
  }

  onAddCommune() {
    this.isCommuneLoading = true;
    this.featuresService.addSwisstopoFeature(
      this.communeForm.value.communeName
    );
  }
}
