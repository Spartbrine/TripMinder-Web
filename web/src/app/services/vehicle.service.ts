import { Injectable, Inject } from '@angular/core';
import { Vehicle, ListWCursor } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class VehicleService extends ApiService<Vehicle>{
    constructor(http: HttpClient){
        super(http);
    }

    public root(): string {
        return 'vehicles';
    }
    public search(shortName: string): Observable<ListWCursor<Vehicle>> {
        return this.http.get<ListWCursor<Vehicle>>(`${this.uri}/search/${shortName}`);
    }
}
