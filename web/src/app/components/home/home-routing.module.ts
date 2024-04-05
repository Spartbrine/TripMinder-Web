import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from '../not-found/not-found.component';
import { UsersComponent } from '../users/users.component';

import { ProfilesComponent } from '../profiles/profiles.component';
import { JwtInterceptor } from 'shared/helpers/jwt.interceptor';
import { ProfileGuard } from 'shared/helpers/profile.guard';
import { Profile } from 'shared/constants';
import { UserAccountComponent } from '../user-account/user-account.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [JwtInterceptor],
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      /** routerlinks Dashboard */
      {
        path: 'profiles', component: ProfilesComponent,
        // canActivate: [ProfileGuard],
        // data: { type_profile: [Profile.ADMIN] }},
      },
      /** routerlinks Other */
      { path: 'account', component: UserAccountComponent },
      /** routerlinks Support */
      {
        path: 'users',
        //  canActivate: [ProfileGuard],
        //  data: {type_profile: [Profile.ADMIN]},
        loadChildren: () => import('../users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'permissions',
        loadChildren: () => import('../permission/permission.module').then(m => m.PermissionModule)
      },
      {
        path: 'configurationsystem',
        loadChildren: () => import('../configuration-system/configuration-system.module').then(m => m.ConfigurationSystemModule)
      },
      {
        path: 'transporttypes',
        loadChildren: () => import('../transport-type/transport-type.module').then(m => m.TransportTypeModule)
      },
      {
        path: 'vehicles',
        loadChildren: () => import('../vehicle/vehicle.module').then(m => m.VehicleModule)
      },
      {
        path: 'incidenttypes',
        loadChildren: () => import('../incident-type/incident-type.module').then(m => m.IncidentTypeModule)
      },
      {
        path: 'fueltypes',
        loadChildren: () => import('../fuel-type/fuel-type.module').then(m => m.FuelTypeModule)
      },
      {
        path: 'clients',
        loadChildren: () => import('../client/client.module').then(m => m.ClientModule)
      },
      {
        path: 'responsibles',
        loadChildren: () => import('../responsible/responsible.module').then(m => m.ResponsibleModule)
      },
      {
        path: 'facilities',
        loadChildren: () => import('../facility/facility.module').then(m => m.FacilityModule)
      },
      {
        path: 'incidents',
        loadChildren: () => import('../incident/incident.module').then(m => m.IncidentModule)
      },
      {
        path: 'deliveries',
        loadChildren: () => import('../delivery/delivery.module').then(m => m.DeliveryModule)
      },
      {
        path: 'trips',
        loadChildren: () => import('../trip/trip.module').then(m => m.TripModule)
      },
      {
        path: 'fueltrips',
        loadChildren: () => import('../fuel-trip/fuel-trip.module').then(m => m.FuelTripModule)
      },
      // { path: 'helpdesk', component:  },
      { path: 'not-found', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }