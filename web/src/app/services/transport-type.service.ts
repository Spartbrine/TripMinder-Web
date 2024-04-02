import { Injectable, Inject } from '@angular/core';
import { TransportType, ListWCursor } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class TransportTypeService extends ApiService<TransportType>{
    constructor(http: HttpClient){
        super(http);
    }

    public root(): string {
        return 'transporttypes';
    }
    public search(shortName: string): Observable<ListWCursor<TransportType>> {
        return this.http.get<ListWCursor<TransportType>>(`${this.uri}/search/${shortName}`);
    }
}
