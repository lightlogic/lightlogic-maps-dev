import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
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
  idDataLoading = false;
  comOptions: string[] = ['Ins', 'Ittigen', 'Kerzers'];
  rivOptions: string[] = ['Thièle', 'Singine', 'Rhin'];
  filteredComOptions: Observable<string[]>;
  filteredRivOptions: Observable<string[]>;

  constructor(public featuresService: FeaturesService) {}

  ngOnInit() {
    this.filteredComOptions = this.communeControl.valueChanges.pipe(
      startWith(''),
      map((cvalue) => this._cfilter(cvalue))
    );

    this.filteredRivOptions = this.riverControl.valueChanges.pipe(
      startWith(''),
      map((rvalue) => this._rfilter(rvalue))
    );
  }

  private _cfilter(value: string): string[] {
    const filtercValue = value.toLowerCase();

    return this.comOptions.filter(coption => coption.toLowerCase().includes(filtercValue));
  }

  private _rfilter(value: string): string[] {
    const filterrValue = value.toLowerCase();

    return this.rivOptions.filter(roption => roption.toLowerCase().includes(filterrValue));
  }


  // onAddCommune() {
  //   this.idDataLoading = true;
  //   this.featuresService.addSwisstopoCommune(
  //     this.communeForm.value.communeName
  //   );
  // }

  // onAddRiver() {
  //   this.idDataLoading = true;
  //   this.featuresService.addSwisstopoRiver(this.riverForm.value.riverName);
  // }

  onPickCommune() {
    console.log(this.communeControl.value);
  }
  onPickRiver() {
    console.log(this.riverControl.value);
  }
}
