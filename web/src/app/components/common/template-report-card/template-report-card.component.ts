import { Component, Input } from '@angular/core';

@Component({
   selector: 'app-template-report-card',
   templateUrl: './template-report-card.component.html'
})

export class TemplateReportCardComponent {
   tableSkeleton = new Array(9);
   tdSkeleton = new Array(11);
   @Input()
   _data: any;
}
