import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidentTypeRoutingModule } from './incident-type-routing.module';

import { pgSelectfx } from 'src/app/@pages/components/cs-select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../common/index';
import { pgSelectModule } from 'src/app/@pages/components/select/select.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { IncidentTypeComponent,IncidentTypeDialogComponent } from './incident-type.component';


@NgModule({
  declarations: [
    IncidentTypeComponent,
    IncidentTypeDialogComponent
  ],
  imports: [
    CommonModule,
    IncidentTypeRoutingModule,
    pgSelectModule,
    MainModule,
    FormsModule,
    FontAwesomeModule,
    pgSelectfx,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class IncidentTypeModule { }
