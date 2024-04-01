import { Pipe, PipeTransform } from '@angular/core';

// nombre que vamos a poner en el filtro, ejemplo: "{{ 5 | forNumber}}"
@Pipe({
  name: 'zeroFilled'
})
export class ZeroFilled implements PipeTransform {
// valor es el numero que pasamos
  transform(valor: string, limit: number): string {
    let value = '';
    let length = valor.length;
    if (valor.length < limit) {
      while (length < limit) {
        value += '0';
        length++;
      }
    }
    return value + valor;
  }
}

@Pipe({
  name: 'removeComma'
})
export class RemoveCommaPipe implements PipeTransform {

  transform(value: string): string {
    if (value !== undefined && value !== null) {
      return value.replace(/,/g, "");
    } else {
      return "";
    }
  }
}