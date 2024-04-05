import { Injectable, Inject } from '@angular/core';
import { Incident, ListWCursor } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class IncidentService extends ApiService<Incident>{
    constructor(http: HttpClient){
        super(http);
    }

    public root(): string {
        return 'incidents';
    }
    public search(shortName: string): Observable<ListWCursor<Incident>> {
        return this.http.get<ListWCursor<Incident>>(`${this.uri}/search/${shortName}`);
    }
}
