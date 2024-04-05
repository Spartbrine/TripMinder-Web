import { Injectable, Inject } from '@angular/core';
import { Trip, ListWCursor } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class TripService extends ApiService<Trip>{
    constructor(http: HttpClient){
        super(http);
    }

    public root(): string {
        return 'trips';
    }
    public search(shortName: string): Observable<ListWCursor<Trip>> {
        return this.http.get<ListWCursor<Trip>>(`${this.uri}/search/${shortName}`);
    }
}
