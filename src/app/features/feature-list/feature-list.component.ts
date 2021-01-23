import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Feature } from '../feature.model';
import { FeaturesService } from '../features.service';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.css'],
})
export class FeatureListComponent implements OnInit, OnDestroy {

  isLoading = false;
  userIsAuthenticated = false;
  features: Feature[] = [];
  featuresSelected: Feature[] = [];
  error = null;
  private featuresListSub: Subscription;
  private authStatusSubs: Subscription;

  constructor(
    public featuresService: FeaturesService,
    private authService: AuthService
  ) {}

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
      // authStatus has to be retrieved from authService private variable
      // before the current component is initiated -> from getter this.authService.getIsAuth();
      this.userIsAuthenticated = this.authService.getIsAuth();
      // once the current component is created, any change in value (for ex when logging out)
      // can be dealt with the private subscription on this component private authStatusSubs: Subscription;

      this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
    this.featuresListSub.unsubscribe();
  }

  onToggleFeatureSelection(featureId: string, selectionToSet: boolean) {
    this.featuresService.toggleFeatureSelection(featureId, selectionToSet);
  }

  onDeleteFeature(featureId: string) {
    this.featuresService.deleteFeature(featureId);
  }
}
