import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuelTripRoutingModule } from './fuel-trip-routing.module';
import { pgSelectfx } from 'src/app/@pages/components/cs-select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../common/index';
import { pgSelectModule } from 'src/app/@pages/components/select/select.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FuelTripComponent,FuelTripDialogComponent } from './fuel-trip.component';
import { NgxColorsModule } from 'ngx-colors';

@NgModule({
  declarations: [
    FuelTripComponent,
    FuelTripDialogComponent
  ],
  imports: [
    CommonModule,
    FuelTripRoutingModule,
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
export class FuelTripModule { }