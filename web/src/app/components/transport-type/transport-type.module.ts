import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportTypeRoutingModule } from './transport-type-routing.module';

import { pgSelectfx } from 'src/app/@pages/components/cs-select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../common/index';
import { pgSelectModule } from 'src/app/@pages/components/select/select.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TransportTypeComponent,TransportTypeDialogComponent } from './transport-type.component';
@NgModule({
  declarations: [
    TransportTypeComponent,
    TransportTypeDialogComponent
  ],
  imports: [
    CommonModule,
    TransportTypeRoutingModule,
    pgSelectModule,
    MainModule,
    FormsModule,
    FontAwesomeModule,
    pgSelectfx,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class TransportTypeModule { }
