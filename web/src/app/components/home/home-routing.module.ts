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
      //    {
      //      path: 'localities',
      // //    //  canActivate: [ProfileGuard],
      // //    //  data: {type_profile: [Profile.ADMIN]},
      //      loadChildren: () => import('../locality/locality.module').then(m => m.LocalityModule)
      // },
      {
        path: 'permissions',
        loadChildren: () => import('../permission/permission.module').then(m => m.PermissionModule)
      },
      {
        path: 'configurationsystem',
        loadChildren: () => import('../configuration-system/configuration-system.module').then(m => m.ConfigurationSystemModule)
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