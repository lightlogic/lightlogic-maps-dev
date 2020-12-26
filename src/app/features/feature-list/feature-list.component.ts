import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Feature } from '../feature.model';
import { FeaturesService } from '../features.service';

@Component({
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.css'],
})
export class FeatureListComponent implements OnInit, OnDestroy {

  features: Feature[] = [];
  private featuresSub: Subscription;

  constructor(public featuresService: FeaturesService) {}

  ngOnInit(): void {
    this.featuresService.getFeatures();
    this.featuresSub = this.featuresService
      .getFeatureUpdateListener()
      .subscribe((features: Feature[]) => {
        this.features = features;
      });
  }

  onDelete(featureId: string) {
    this.featuresService.deleteFeature(featureId);
  }

  ngOnDestroy() {
    this.featuresSub.unsubscribe();
  }
}
