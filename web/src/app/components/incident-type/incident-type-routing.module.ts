import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidentTypeComponent } from './incident-type.component';

const routes: Routes = [
  {
    path:'',
    component: IncidentTypeComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidentTypeRoutingModule { }
