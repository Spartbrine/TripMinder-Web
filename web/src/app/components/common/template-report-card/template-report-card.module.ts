import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TemplateReportCardComponent } from './template-report-card.component';

@NgModule({
   declarations: [TemplateReportCardComponent],
   exports: [TemplateReportCardComponent],
   imports: [SharedModule],
})

export class TemplateReportCardModule {
   
}
