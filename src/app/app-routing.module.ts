import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureCreateComponent } from './features/feature-create/feature-create.component';
import { FeatureListComponent } from './features/feature-list/feature-list.component';
import { SettingsModifyComponent } from './appsettings/settings-modify.component';
import { HydroMapComponent } from './maps/geomap/geomap.component';

const routes: Routes = [
  { path: '', component: HydroMapComponent },
  { path: 'display', component: FeatureListComponent },
  { path: 'create', component: FeatureCreateComponent },
  { path: 'configure', component: SettingsModifyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
