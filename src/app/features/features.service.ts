import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Feature } from './feature.model';

@Injectable({ providedIn: 'root' })
export class FeaturesService {
  private features: Feature[] = [];
  private featuresUpdated = new Subject<Feature[]>();
  private featuresSelected = new Subject<Feature[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getFeatures() {
    this.http
      .get<{ message: string; features: any }>(
        'http://localhost:3000/api/features'
      )
      .pipe(
        map((featureData) => {
          return featureData.features.map((feature) => {
            return {
              id: feature._id,
              featureOf: feature.featureOf,
              projection: feature.projection,
              geoJSONraw: feature.geoJSONraw,
              selected: feature.selected,
              featureOfLabel: feature.featureOfLabel,
              featureOfbfsNum: feature.featureOfbfsNum,
            };
          });
        })
      )
      // transformedFeatures is the result of the modified feature by the map function (_id field -> id)
      .subscribe((transformedFeatures) => {
        this.features = transformedFeatures;
        this.featuresUpdated.next([...this.features]);
      });
  }

  addSwisstopoFeature(communeName: string) {
    const newCommune = {
      commName: communeName,
    };
    this.http
      .post<{ message: string; feature: Feature }>(
        'http://localhost:3000/api/features/swisstopo',
        newCommune
      )
      .subscribe((responseJson) => {
        if (responseJson.feature) {
          console.log(responseJson.feature);
          this.features.push(responseJson.feature);
          this.featuresUpdated.next([...this.features]);
          this.router.navigate(['/display']);
        } else {
          console.log(responseJson.message);
          this.router.navigate(['/display']);
        }
      });
  }

  addCustomFeature(
    id: string,
    geoJSONraw: string,
    projection: string,
    selected: boolean
  ) {
    const feature: Feature = {
      id: null,
      geoJSONraw: JSON.parse(geoJSONraw),
      projection: projection,
      selected: false,
      featureOf: 'null',
      featureOfLabel: 'null',
      featureOfbfsNum: 0,
    };
    this.http
      .post<{ message: string; featureId: string }>(
        'http://localhost:3000/api/features/custom',
        feature
      )
      .subscribe((responseData) => {
        const id = responseData.featureId;
        feature.id = id;
        this.features.push(feature);
        this.featuresUpdated.next([...this.features]);
        this.router.navigate(['/display']);
      });
  }

  getFeatureUpdateListener() {
    return this.featuresUpdated.asObservable();
  }

  deleteFeature(featureId: string) {
    this.http
      .delete('http://localhost:3000/api/features/' + featureId)
      .subscribe(() => {
        // to keep in the local array of features the posts that does not have featureId
        // and delete the one that has the featureId
        // -> filter checks every elements of an array against a condition. It will keep the element that does NOT match the condition
        const featuresWithoutTheDeleted = this.features.filter(
          (feature) => feature.id !== featureId
        );
        this.features = featuresWithoutTheDeleted;
        this.featuresUpdated.next([...this.features]);
      });
  }

  toggleFeatureSelection(featureId: string, selectionToSet: boolean) {
    const selectedValue = {
      selected: selectionToSet,
    };
    this.http
      .patch(
        'http://localhost:3000/api/features/select/' + featureId,
        selectedValue
      )
      .subscribe(() => {
        this.features.find((x) => x.id === featureId).selected = selectionToSet;
        this.featuresUpdated.next([...this.features]);
      });
  }

  getFeaturesSelectedListener() {
    return this.featuresSelected.asObservable();
  }
}
