import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentRoutingModule } from './agent-routing.module';
import { AgentComponent, CreateAgentDialogComponent } from './agent.component';
import { pgSelectModule } from 'src/app/@pages/components/select/select.module';
import { MainModule } from '../common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { pgSelectfx } from 'src/app/@pages/components/cs-select/select.module';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    AgentComponent,
    CreateAgentDialogComponent,
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
    AgentRoutingModule,
  ],
  entryComponents: [
    AgentComponent
  ],
  providers: []
})
export class AgentModule { }
