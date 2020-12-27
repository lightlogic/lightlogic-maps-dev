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
              uri: feature.uri,
              description: feature.description,
              wktGeometry: feature.wktGeometry,
              projection: feature.projection,
              id: feature._id,
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

  getFeatureUpdateListener() {
    return this.featuresUpdated.asObservable();
  }

  addFeature(
    id: string,
    uri: string,
    description: string,
    wktGeometry: string,
    projection: string
  ) {
    const feature: Feature = {
      id: null,
      uri: uri,
      description: description,
      wktGeometry: wktGeometry,
      projection: projection,
    };
    this.http
      .post<{ message: string, featureId: string }>('http://localhost:3000/api/features', feature)
      .subscribe((responseData) => {
        const id = responseData.featureId;
        feature.id = id;
        this.features.push(feature);
        this.featuresUpdated.next([...this.features]);
        this.router.navigate(["/display"])
      });
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
}
