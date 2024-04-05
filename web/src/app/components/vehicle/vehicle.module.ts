import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { pgSelectfx } from 'src/app/@pages/components/cs-select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../common/index';
import { pgSelectModule } from 'src/app/@pages/components/select/select.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VehicleComponent,VehicleDialogComponent } from './vehicle.component';
import { NgxColorsModule } from 'ngx-colors';

@NgModule({
  declarations: [
    VehicleComponent,
    VehicleDialogComponent
  ],
  imports: [
    CommonModule,
    VehicleRoutingModule,
    pgSelectModule,
    MainModule,
    FormsModule,
    FontAwesomeModule,
    pgSelectfx,
    ReactiveFormsModule,
    MatDialogModule,
    NgxColorsModule,
  ]
})
export class VehicleModule { }
