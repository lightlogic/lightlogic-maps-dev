import { Component } from '@angular/core';

import { FeaturesService } from '../features/features.service';
@Component({
  templateUrl: './settings-modify.component.html',
  styleUrls: ['./settings-modify.component.css'],
})
export class SettingsModifyComponent {
  isDataLoading = false;

  constructor(public featuresService: FeaturesService) {}

  onClickUpdateList(itemType: string) {
    this.isDataLoading = true;
    this.featuresService.updateListItems(itemType);
  }

  onClickDeleteList(itemType: string) {
    this.isDataLoading = true;
    this.featuresService.purgeListItems(itemType);
  }
}
