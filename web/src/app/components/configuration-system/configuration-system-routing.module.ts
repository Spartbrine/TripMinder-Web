import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationSystemComponent } from './configuration-system.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationSystemComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationSystemRoutingModule { }
