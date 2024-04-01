import { Injectable, Inject } from '@angular/core';
import { Profile } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ProfileService extends ApiService<Profile>{
    constructor(http: HttpClient){
        super(http);
    }

    public root(): string {
        return 'profiles';
    }

    public assign(e: Profile): Observable<Profile> {
        return this.http.post<Profile>(`${this.uri}/assign`, e);
    }
}