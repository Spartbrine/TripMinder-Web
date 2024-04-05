import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacilityRoutingModule } from './facility-routing.module';

import { pgSelectfx } from 'src/app/@pages/components/cs-select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../common/index';
import { pgSelectModule } from 'src/app/@pages/components/select/select.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { FacilityComponent, FacilityDialogComponent } from './facility.component';

@NgModule({
  declarations: [
    FacilityComponent,
    FacilityDialogComponent
  ],
  imports: [
    CommonModule,
    FacilityRoutingModule,
    pgSelectModule,
    MainModule,
    FormsModule,
    FontAwesomeModule,
    pgSelectfx,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class FacilityModule { }
