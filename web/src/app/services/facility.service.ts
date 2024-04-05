import { Injectable, Inject } from '@angular/core';
import { Facility, ListWCursor } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class FacilityService extends ApiService<Facility>{
    constructor(http: HttpClient){
        super(http);
    }

    public root(): string {
        return 'facilities';
    }
    public search(shortName: string): Observable<ListWCursor<Facility>> {
        return this.http.get<ListWCursor<Facility>>(`${this.uri}/search/${shortName}`);
    }
}
