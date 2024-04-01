import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationSystemRoutingModule } from './configuration-system-routing.module';
import { pgSelectfx } from 'src/app/@pages/components/cs-select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../common/index';
import { pgSelectModule } from 'src/app/@pages/components/select/select.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfigurationSystemComponent } from './configuration-system.component';

import { NgxColorsModule } from 'ngx-colors';


@NgModule({
  declarations: [
    ConfigurationSystemComponent,
  ],
  imports: [
    CommonModule,
    pgSelectModule,
    MainModule,
    FormsModule,
    FontAwesomeModule,
    pgSelectfx,
    ReactiveFormsModule,
    MatDialogModule,
    ConfigurationSystemRoutingModule,
    NgxColorsModule,
    
  ]
})
export class ConfigurationSystemModule { }
