import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportRoutingModule } from './import-routing.module';
import { ImportComponent } from './import.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { pgSelectfx } from 'src/app/@pages/components/cs-select/select.module';
import { pgSelectModule } from 'src/app/@pages/components/select/select.module';
import { pgUploadModule } from 'src/app/@pages/components/upload/upload.module';
import { MainModule } from '../common';


@NgModule({
  declarations: [
    ImportComponent
  ],
  imports: [
    CommonModule,
    pgSelectModule,
    pgUploadModule,
    MainModule,
    FormsModule,
    FontAwesomeModule,
    TypeaheadModule,
    pgSelectfx,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    ImportRoutingModule
  ]
})
export class ImportModule { }
