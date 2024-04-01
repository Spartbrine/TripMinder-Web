import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SeducCatalog {

  constructor() { }

  /**
   * name
   */
  get genres() {
    return ['Hombre', 'Mujer'];
  }

}

export class CecytecCatalog {
  constructor() { }

  getStatuses() {
    return [{value: 'ALTA', label: 'Alta'},
      {value: 'BAJATEMPORAL', label: 'Baja Temporal'},
      {value: 'BAJADEFINITIVA', label: 'Baja Definitiva'},
      {value: 'EGRESADO', label: 'Egresado'}]
  }
}
