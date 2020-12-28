import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  private featureId: string;
  private featureData: Feature;
  private swisstopoFeatureSub: Subscription;

  constructor(
    public featuresService: FeaturesService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.featureId = null;
    this.featuresService.getSwisstopoFeature(
      'query=PREFIX+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E%0APREFIX+geo%3A+%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23%3E%0APREFIX+gn%3A+%3Chttp%3A%2F%2Fwww.geonames.org%2Fontology%23%3E%0A%0ASELECT+%3FCommune+%3FName+%3FWKT%0AWHERE+%7B%0A%3FCommune+gn%3AfeatureCode+gn%3AA.ADM3+.%0A%3FCommune+schema%3Aname+%22Murten%22+.%0A%3FCommune+geo%3AdefaultGeometry+%3FGeometry+.%0A%3FGeometry+geo%3AasWKT+%3FWKT+.%0A%3FCommune+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fissued%3E+%3FDate+.%0AFILTER+(%3FDate+%3D+%222020-01-01%22%5E%5Exsd%3Adate)%0A%7D'
    );
    this.swisstopoFeatureSub = this.featuresService
      .getSwisstopoFeatureListener()
      .subscribe((subsFeature: Feature) => {
        this.featureData = subsFeature;
      console.log(this.featureData);
      });
  }

  onSaveFeature(form: NgForm) {
    this.featuresService.addFeature(
      this.featureId,
      form.value.uri,
      form.value.description,
      form.value.wktGeometry,
      form.value.projection
    );
    form.resetForm();
  }
}
