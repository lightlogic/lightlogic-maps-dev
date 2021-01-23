import { Component } from '@angular/core';

import { FeaturesService } from '../features/features.service';
@Component({
  selector: 'app-settings-modify',
  templateUrl: './settings-modify.component.html',
  styleUrls: ['./settings-modify.component.css'],
})
export class SettingsModifyComponent {
  isDataLoading = false;

  constructor(public featuresService: FeaturesService) {}

  onClickUpdateList() {
    this.isDataLoading = true;
    this.featuresService.updateListCommunes("commune")
  }

  onClickDeleteList() {
    this.isDataLoading = true;
    this.featuresService.purgeListCommunes("commune")
  }
}
