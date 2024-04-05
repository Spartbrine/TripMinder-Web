import { Injectable, Inject } from '@angular/core';
import { Client, ListWCursor } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ClientService extends ApiService<Client>{
    constructor(http: HttpClient){
        super(http);
    }

    public root(): string {
        return 'clients';
    }
    public search(shortName: string): Observable<ListWCursor<Client>> {
        return this.http.get<ListWCursor<Client>>(`${this.uri}/search/${shortName}`);
    }
}
