import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureCreateComponent } from './features/feature-create/feature-create.component';
import { FeatureListComponent } from './features/feature-list/feature-list.component';
import { SettingsModifyComponent } from './appsettings/settings-modify.component';
import { HydroMapComponent } from './maps/geomap/geomap.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: HydroMapComponent },
  { path: 'display', component: FeatureListComponent },
  { path: 'create', component: FeatureCreateComponent, canActivate: [AuthGuard] },
  { path: 'configure', component: SettingsModifyComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
