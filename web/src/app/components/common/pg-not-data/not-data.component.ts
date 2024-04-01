import { Component, Input } from '@angular/core';

@Component({
   selector: 'app-not-data',
   templateUrl: './not-data.component.html'
})

export class NotDataComponent {
   _text: string;
   _svg = 'no-data.svg';

   @Input()
   set Text(value: string) {
      this._text = value;
   }

   get Text() {
      return this._text;
   }

   @Input()
   set SVG(value: string) {
      this._svg = value;
   }

   get SVG() {
      return this._svg;
   }
}
