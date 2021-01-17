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
  riverForm: FormGroup;
  idDataLoading = false;
  private featureId: string;

  constructor(public featuresService: FeaturesService) {}

  ngOnInit() {
    this.featureId = null;
    // Commune Form
    this.communeForm = new FormGroup({
      communeName: new FormControl(null),
    });
    this.riverForm = new FormGroup({
      riverName: new FormControl(null),
    });
  }

  onAddCommune() {
    this.idDataLoading = true;
    this.featuresService.addSwisstopoCommune(
      this.communeForm.value.communeName
    );
  }

  onAddRiver() {
    this.idDataLoading = true;
    this.featuresService.addSwisstopoRiver(this.riverForm.value.riverName);
  }
}
