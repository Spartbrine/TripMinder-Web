import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { pgSelectfx } from 'src/app/@pages/components/cs-select/select.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MainModule } from '../common/index';
import { pgSelectModule } from 'src/app/@pages/components/select/select.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CreateUsersDialogComponent, UsersComponent } from './users.component';

// import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations: [
      /* App Components */
      UsersComponent,
      /* Dialogs */
      CreateUsersDialogComponent,
      /* Common */
    // FilterTagsComponent,
    // SkeletonLoadingComponent,
    ],
    imports: [
      CommonModule,
      pgSelectModule,
      MainModule,
      FormsModule,
      FontAwesomeModule,
      pgSelectfx,
      FormsModule,
      ReactiveFormsModule,
      MatDialogModule,
      UsersRoutingModule,
      MatDialogModule
    ]
  })
  export class UsersModule { }
