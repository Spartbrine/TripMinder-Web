import { Component, Input } from '@angular/core';

export interface IStatusCard {
   statusNumber: number;
   isCompleted: boolean;
   title: string;
   textBody: string;
}

@Component({
   selector: 'app-status-card',
   templateUrl: './status-card.component.html',
   styleUrls: ['./status-card.component.scss']
})

export class StatusCardComponent {
   @Input() status: IStatusCard;
   @Input() isClickeable: boolean;
}
