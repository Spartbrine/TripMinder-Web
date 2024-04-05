import { Injectable, Inject } from '@angular/core';
import { Delivery, ListWCursor } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class DeliveryService extends ApiService<Delivery>{
    constructor(http: HttpClient){
        super(http);
    }

    public root(): string {
        return 'deliveries';
    }
    public search(shortName: string): Observable<ListWCursor<Delivery>> {
        return this.http.get<ListWCursor<Delivery>>(`${this.uri}/search/${shortName}`);
    }
}
