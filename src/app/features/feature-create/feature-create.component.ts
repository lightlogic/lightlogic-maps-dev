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
  isCommuneLoading = false;
  private featureId: string;

  constructor(public featuresService: FeaturesService) {}

  ngOnInit() {
    this.featureId = null;
    // Commune Form
    this.communeForm = new FormGroup({
      communeName: new FormControl(null),
    });
  }

  onAddCommune() {
    this.isCommuneLoading = true;
    this.featuresService.addSwisstopoFeature(
      this.communeForm.value.communeName
    );
  }
}
