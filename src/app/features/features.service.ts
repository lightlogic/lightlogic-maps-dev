import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Feature } from './feature.model';


@Injectable({providedIn: 'root'})
export class FeaturesService {
  private features: Feature[] = [];
  private featuresUpdated = new Subject<Feature[]>();

  constructor (private http: HttpClient) {}

  getFeatures() {
    this.http.get<{message: string, features: Feature[]}>('http://localhost:3000/api/features')
      .subscribe((featureData) => {
        this.features = featureData.features;
        this.featuresUpdated.next([...this.features]);
      });
  }

  getFeatureUpdateListener(){
    return this.featuresUpdated.asObservable();
  }

  addFeature(id: string, uri: string, description: string, wktGeometry: string, projection: string) {
    const feature: Feature = {
      id: null,
      uri: uri,
      description: description,
      wktGeometry: wktGeometry,
      projection: projection
    };
    this.features.push(feature);
    this.featuresUpdated.next([...this.features]);
  }
}
