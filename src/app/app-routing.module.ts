import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { FeatureCreateComponent } from "./features/feature-create/feature-create.component";
import { FeatureListComponent } from "./features/feature-list/feature-list.component";
import { HydroMapComponent } from "./maps/hydro-map/hydro-map.component";

const routes: Routes = [
  { path: '', component: HydroMapComponent },
  { path: 'display', component: FeatureListComponent},
  { path: 'create', component: FeatureCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
