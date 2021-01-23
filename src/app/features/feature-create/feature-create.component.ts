import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FeaturesService } from '../features.service';
@Component({
  selector: 'app-feature-create',
  templateUrl: './feature-create.component.html',
  styleUrls: ['./feature-create.component.css'],
})
export class FeatureCreateComponent implements OnInit {
  communeControl = new FormControl();
  riverControl = new FormControl();
  isDataLoading = false;
  comItems: string[] = ['Ins', 'Ittigen', 'Kerzers'];
  rivItems: string[] = ['Thièle', 'Singine', 'Rhin'];
  filteredComItems: Observable<string[]>;
  filteredRivItems: Observable<string[]>;
  private communesListSub: Subscription;
  private riverListSub: Subscription;

  constructor(public featuresService: FeaturesService) {}

  ngOnInit() {
    this.featuresService.getItemList('commune');
    this.communesListSub = this.featuresService
      .getlstItemsUpdatedListener()
      .subscribe((communes: string[]) => {
        this.comItems = communes;
        this.filteredComItems = this.communeControl.valueChanges.pipe(
          startWith(''),
          map((cvalue) => this._cfilter(cvalue))
        );
      });
    this.featuresService.getItemList('river');
    this.riverListSub = this.featuresService
      .getlstRiversUpdatedListener()
      .subscribe((rivers: string[]) => {
        this.rivItems = rivers;
        this.filteredRivItems = this.riverControl.valueChanges.pipe(
          startWith(''),
          map((rvalue) => this._rfilter(rvalue))
        );
      });
  }

  private _cfilter(value: string): string[] {
    const filtercValue = value.toLowerCase();

    return this.comItems.filter((coption) =>
      coption.toLowerCase().includes(filtercValue)
    );
  }

  private _rfilter(value: string): string[] {
    const filterrValue = value.toLowerCase();

    return this.rivItems.filter((roption) =>
      roption.toLowerCase().includes(filterrValue)
    );
  }

  onPickCommune() {
    this.isDataLoading = true;
    this.featuresService.addSwisstopoCommune(this.communeControl.value);
  }

  onPickRiver() {
    this.isDataLoading = true;
    this.featuresService.addSwisstopoRiver(this.riverControl.value);
  }
}
