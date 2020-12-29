import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Feature } from '../feature.model';

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
  private featureData: Feature;
  private swisstopoFeatureSub: Subscription;

  constructor(
    public featuresService: FeaturesService,
    public route: ActivatedRoute
  ) {}

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
    this.featuresService.addSwisstopoFeature(this.communeForm.value.communeName);
    this.swisstopoFeatureSub = this.featuresService
      .getSwisstopoFeatureListener()
      .subscribe((subsFeature: Feature) => {
        this.featureData = subsFeature;
        //TODO #6
        // plus nécessaire this.featureData.description = this.communeForm.value.communeName
        console.log(this.featureData);
        this.communeForm.reset;
        this.isCommuneLoading = false;
      });
  }
}
