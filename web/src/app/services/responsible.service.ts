import { Injectable, Inject } from '@angular/core';
import { Responsible, ListWCursor } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ResponsibleService extends ApiService<Responsible>{
    constructor(http: HttpClient){
        super(http);
    }

    public root(): string {
        return 'responsibles';
    }
    public search(shortName: string): Observable<ListWCursor<Responsible>> {
        return this.http.get<ListWCursor<Responsible>>(`${this.uri}/search/${shortName}`);
    }
}
