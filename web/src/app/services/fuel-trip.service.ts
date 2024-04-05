import { Injectable, Inject } from '@angular/core';
import { FuelTrip, ListWCursor } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class FuelTripService extends ApiService<FuelTrip>{
    constructor(http: HttpClient){
        super(http);
    }

    public root(): string {
        return 'fueltrips';
    }
    public search(shortName: string): Observable<ListWCursor<FuelTrip>> {
        return this.http.get<ListWCursor<FuelTrip>>(`${this.uri}/search/${shortName}`);
    }
}