import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { StatusCardComponent } from './status-card.component';

@NgModule({
   declarations: [StatusCardComponent],
   exports: [
      StatusCardComponent
   ],
   imports: [
     SharedModule
   ]
})

export class StatusCardModule {}
