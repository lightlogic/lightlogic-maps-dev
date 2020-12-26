import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FeaturesService } from '../features.service';

@Component({
  selector: 'app-feature-create',
  templateUrl: './feature-create.component.html',
  styleUrls: ['./feature-create.component.css'],
})
export class FeatureCreateComponent implements OnInit {
  private featureId: string;

  constructor(
    public featureService: FeaturesService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.featureId = null;
  }

  onSaveFeature(form: NgForm) {
    this.featureService.addFeature(
      this.featureId,
      form.value.uri,
      form.value.description,
      form.value.wktGeometry,
      form.value.projection
    );
    form.resetForm();
  }
}
