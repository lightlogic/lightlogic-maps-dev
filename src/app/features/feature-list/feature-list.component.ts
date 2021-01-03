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
  isLoading = false;
  features: Feature[] = [];
  error = null;
  private featuresListSub: Subscription;

  constructor(public featuresService: FeaturesService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.featuresService.getFeatures();
    this.featuresListSub = this.featuresService
      .getFeatureUpdateListener()
      .subscribe((features: Feature[]) => {
        this.features = features;
        this.isLoading = false;
      });
  }

  onToggleFeatureSelection(featureId: string, selectionToSet: boolean) {
    this.featuresService.toggleFeatureSelection(featureId, selectionToSet);
  }

  onDeleteFeature(featureId: string) {
    this.featuresService.deleteFeature(featureId);
  }

  ngOnDestroy() {
    this.featuresListSub.unsubscribe();
  }
}
