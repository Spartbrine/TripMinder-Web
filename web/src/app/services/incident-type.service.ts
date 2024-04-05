import { Injectable, Inject } from '@angular/core';
import { IncidentType, ListWCursor } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class IncidentTypeService extends ApiService<IncidentType>{
    constructor(http: HttpClient){
        super(http);
    }

    public root(): string {
        return 'incidenttypes';
    }
    public search(shortName: string): Observable<ListWCursor<IncidentType>> {
        return this.http.get<ListWCursor<IncidentType>>(`${this.uri}/search/${shortName}`);
    }
}
