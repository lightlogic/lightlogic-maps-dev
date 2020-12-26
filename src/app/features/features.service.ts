import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Feature } from './feature.model';

@Injectable({ providedIn: 'root' })
export class FeaturesService {
  private features: Feature[] = [];
  private featuresUpdated = new Subject<Feature[]>();

  constructor(private http: HttpClient) {}

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
      .post<{ message: string }>('http://localhost:3000/api/features', feature)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.features.push(feature);
        this.featuresUpdated.next([...this.features]);
      });
  }
}
