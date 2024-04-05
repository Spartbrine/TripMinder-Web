import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryRoutingModule } from './delivery-routing.module';
import { pgSelectfx } from 'src/app/@pages/components/cs-select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../common/index';
import { pgSelectModule } from 'src/app/@pages/components/select/select.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DeliveryComponent,DeliveryDialogComponent } from './delivery.component';
import { NgxColorsModule } from 'ngx-colors';

@NgModule({
  declarations: [
    DeliveryComponent,
    DeliveryDialogComponent
  ],
  imports: [
    CommonModule,
    DeliveryRoutingModule,
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
export class DeliveryModule { }
