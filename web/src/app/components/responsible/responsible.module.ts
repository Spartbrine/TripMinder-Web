import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponsibleRoutingModule } from './responsible-routing.module';

import { pgSelectfx } from 'src/app/@pages/components/cs-select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../common/index';
import { pgSelectModule } from 'src/app/@pages/components/select/select.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ResponsibleComponent,ResponsibleDialogComponent } from './responsible.component';
@NgModule({
  declarations: [
    ResponsibleComponent,
    ResponsibleDialogComponent
  ],
  imports: [
    CommonModule,
    ResponsibleRoutingModule,
    pgSelectModule,
    MainModule,
    FormsModule,
    FontAwesomeModule,
    pgSelectfx,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class ResponsibleModule { }
