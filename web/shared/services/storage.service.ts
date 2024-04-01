import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private URL = 'http://localhost:8000/storage/'

  constructor() { 

  }
  
  public url(): string{
    return this.URL
  }
}
