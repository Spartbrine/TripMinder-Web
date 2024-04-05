import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuelTypeRoutingModule } from './fuel-type-routing.module';

import { pgSelectfx } from 'src/app/@pages/components/cs-select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../common/index';
import { pgSelectModule } from 'src/app/@pages/components/select/select.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { FuelTypeComponent, FuelTypeDialogComponent } from './fuel-type.component';
@NgModule({
  declarations: [
    FuelTypeComponent,
    FuelTypeDialogComponent
  ],
  imports: [
    CommonModule,
    FuelTypeRoutingModule,
    pgSelectModule,
    MainModule,
    FormsModule,
    FontAwesomeModule,
    pgSelectfx,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class FuelTypeModule { }
