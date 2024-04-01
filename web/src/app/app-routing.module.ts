import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent, LoginComponent } from './components';

const config: ExtraOptions = {
    scrollPositionRestoration: 'enabled',
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy',
    useHash: true
};

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, /* canActivate: [CanActivateLoginGuard] */ },
  { path: 'home', component: HomeComponent}, // loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)},
  // {
  //   path: 'privacidad',
  //   loadChildren: () => import('./components/privacidad/privacidad.module').then(m => m.PrivacidadModule)
  // },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
