import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Feature } from '../feature.model';
import { FeaturesService } from '../features.service';
@Component({
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.css'],
})
export class FeatureListComponent implements OnInit, OnDestroy {
  // Features
  isLoading = false;
  features: Feature[] = [];
  featuresSelected: Feature[] = [];
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
        this.featuresSelected = features.filter(
          (feature) => feature.selected == true
        );
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.featuresListSub.unsubscribe();
  }

  onToggleFeatureSelection(featureId: string, selectionToSet: boolean) {
    this.featuresService.toggleFeatureSelection(featureId, selectionToSet);
  }

  onDeleteFeature(featureId: string) {
    this.featuresService.deleteFeature(featureId);
  }
}
