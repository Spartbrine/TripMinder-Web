import { Injectable, Inject } from '@angular/core';
import { FuelType, ListWCursor } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class FuelTypeService extends ApiService<FuelType>{
    constructor(http: HttpClient){
        super(http);
    }

    public root(): string {
        return 'fueltypes';
    }
    public search(shortName: string): Observable<ListWCursor<FuelType>> {
        return this.http.get<ListWCursor<FuelType>>(`${this.uri}/search/${shortName}`);
    }
}
