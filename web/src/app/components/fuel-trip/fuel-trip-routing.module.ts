import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuelTripComponent } from './fuel-trip.component';
const routes: Routes = [{
  path:'',
  component:FuelTripComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuelTripRoutingModule { }
