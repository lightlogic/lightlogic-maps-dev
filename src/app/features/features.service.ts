import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Feature } from './feature.model';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiURL;
const RIVER_ISA_URI = environment.featureRiver_isA_URI;
const ADMINUNIT_ISA_URI = environment.featureAdminUnit_isA_URI;

@Injectable({ providedIn: 'root' })
export class FeaturesService {
  private features: Feature[] = [];
  private lstCommunes: string[] = [];
  private lstRivers: string[] = [];
  private lstCommunesUpdated = new Subject<string[]>();
  private lstRiversUpdated = new Subject<string[]>();
  private featuresUpdated = new Subject<Feature[]>();
  private featuresSelected = new Subject<Feature[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getFeatures() {
    this.http
      .get<{ message: string; features: any }>(BACKEND_URL + '/geoentities')
      .pipe(
        map((featureData) => {
          return featureData.features.map((feature) => {
            var featureType: string = '';
            if (feature.isA == RIVER_ISA_URI) {
              featureType = 'Rivière';
            } else if ((feature.isA = ADMINUNIT_ISA_URI)) {
              featureType = 'Commune';
            }
            //console.log(feature)
            return {
              id: feature._id,
              uri: feature.uri,
              featureId: feature.domainId,
              featureIdLabel: feature.domainIdLabel,
              featureType: featureType,
              featureName: feature.description,
              geoJSON: feature.geoJSON,
              selected: feature.selected,
              parentFeature: feature.parentLabel,
              bbox: feature.geoJSON[0].bbox,
              projection: 'EPSG:2056',
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

  getItemList(itemType: string) {
    this.http
      .get<{ message: string; items: any }>(BACKEND_URL + '/listitems/' + itemType)
      .pipe(
        map((itemsData) => {
          //return itemsData.items.label;
          return itemsData.items.map((item) => {
            return {
              label: item.label,
            };
          });
        })
      )
      .subscribe((recList) => {
        if (itemType == 'commune') {
          this.lstCommunes.length = 0;
          recList.forEach((itLabel) => {
            this.lstCommunes.push(itLabel.label);
          });
          this.lstCommunesUpdated.next([...this.lstCommunes]);
        } else if (itemType == 'river') {
          this.lstRivers.length = 0;
          recList.forEach((itLabel) => {
            this.lstRivers.push(itLabel.label);
          });
          this.lstRiversUpdated.next([...this.lstRivers]);
        }
      });
  }

  addSwisstopoCommune(communeName: string) {
    const newCommune = {
      commName: communeName,
    };
    this.http
      .post<{ message: string; feature: Feature }>(
        BACKEND_URL + '/geoentities/swisstopo/adminunit',
        newCommune
      )
      .subscribe((responseJson) => {
        if (responseJson.feature) {
          this.features.push(responseJson.feature);
          this.featuresUpdated.next([...this.features]);
          this.router.navigate(['/display']);
        } else {
          this.router.navigate(['/display']);
        }
      });
  }

  addSwisstopoRiver(riverName: string) {
    const newRiver = {
      rivName: riverName,
    };
    this.http
      .post<{ message: string; feature: Feature }>(
        BACKEND_URL + '/geoentities/swisstopo/river',
        newRiver
      )
      .subscribe((responseJson) => {
        if (responseJson.feature) {
          this.features.push(responseJson.feature);
          this.featuresUpdated.next([...this.features]);
          this.router.navigate(['/display']);
        } else {
          this.router.navigate(['/display']);
        }
      });
  }

  getFeatureUpdateListener() {
    return this.featuresUpdated.asObservable();
  }

  deleteFeature(featureId: string) {
    this.http.delete(BACKEND_URL + '/geoentities/' + featureId).subscribe(() => {
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
      .patch(BACKEND_URL + '/geoentities/' + featureId, selectedValue)
      .subscribe(() => {
        this.features.find((x) => x.id === featureId).selected = selectionToSet;
        this.featuresUpdated.next([...this.features]);
      });
  }

  updateListItems(itemType: string) {
    const typeValue = {
      itemTypeValue: itemType,
    };
    this.http
      .patch(BACKEND_URL + '/listitems', typeValue)
      .subscribe((responseJson) => {
        if (itemType == 'commune') {
          this.lstCommunes.length = 0;
          this.lstCommunesUpdated.next();
          this.router.navigate(['/create']);
        } else if (itemType == 'river'){
        this.lstRivers.length = 0;
        this.lstRiversUpdated.next();
        this.router.navigate(['/create']);
      }
      }
      );
  }

  purgeListItems(itemType: string) {
    this.http
      .delete(BACKEND_URL + '/listitems/' + itemType)
      .subscribe((responseJson) => {
        if (itemType == 'commune') {
          this.lstCommunes.length = 0;
          this.lstCommunesUpdated.next();
          this.router.navigate(['/create']);
        } else if (itemType == 'river'){
        this.lstRivers.length = 0;
        this.lstRiversUpdated.next();
        this.router.navigate(['/create']);
      }
      }
      );
  }

  getFeaturesSelectedListener() {
    return this.featuresSelected.asObservable();
  }

  getlstItemsUpdatedListener() {
    return this.lstCommunesUpdated.asObservable();
  }

  getlstRiversUpdatedListener() {
    return this.lstRiversUpdated.asObservable();
  }
}
