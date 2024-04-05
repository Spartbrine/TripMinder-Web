import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidentRoutingModule } from './incident-routing.module';
import { pgSelectfx } from 'src/app/@pages/components/cs-select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../common/index';
import { pgSelectModule } from 'src/app/@pages/components/select/select.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IncidentComponent,IncidentDialogComponent } from './incident.component';
import { NgxColorsModule } from 'ngx-colors';

@NgModule({
  declarations: [
    IncidentComponent,
    IncidentDialogComponent
  ],
  imports: [
    CommonModule,
    IncidentRoutingModule,
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
export class IncidentModule { }
