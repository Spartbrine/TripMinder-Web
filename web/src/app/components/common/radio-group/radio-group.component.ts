import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButton } from 'shared/interfaces';

@Component({
   // eslint-disable-next-line @angular-eslint/component-selector
   selector: 'pg-radio-group',
   templateUrl: './radio-group.component.html',
   styleUrls: ['./radio-group.component.scss'],
   providers: [
      {
         provide: NG_VALUE_ACCESSOR,
         useExisting: forwardRef(() => RadioGroupComponent),
         multi: true
      }
   ]
})

export class RadioGroupComponent implements ControlValueAccessor {
   public innerValue: string | number | boolean;
   public _radioButtons: RadioButton[];
   public _name: string;

   onChange: (value?: string | number | boolean) => void;
   onTouch: (value?: string | number | boolean) => void;

   @Input()
   set name(value: string) {
      this._name = value;
   }

   get name() {
      return this._name;
   }

   @Input()
   set RadioButtons(value: RadioButton[]) {
      this._radioButtons = value;
   }

   get RadioButtons() {
      return this._radioButtons;
   }

   writeValue(value: string | number | boolean): void {
      if (value !== this.innerValue)
         this.innerValue = value;
   }

   registerOnChange(fn: (value: string | number | boolean) => void): void {
      this.onChange = fn;
   }

   registerOnTouched(fn: (value: string | number | boolean) => void): void {
      this.onTouch = fn;
   }

   change(value: string | number | boolean) {
      this.innerValue = value;
      this.onChange(value);
      this.onTouch(value);
   }
}
