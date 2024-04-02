import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportTypeComponent } from './transport-type.component';
const routes: Routes = [{
  path:'',
  component: TransportTypeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportTypeRoutingModule { }
