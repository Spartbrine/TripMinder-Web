import { Injectable, Inject } from '@angular/core';
import { Element, GrouperElements, UserElement, ProfileElement, SimpleList, DataUserElement, OptionsForUserElement } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService, getParams } from 'shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SecurityService extends ApiService<UserElement>{
    constructor(public http: HttpClient) {
        super(http);
    }

    public root(): string {
        return 'security';
    }

    public getElements(): Observable<SimpleList<Element>> {
        return this.http.get<SimpleList<Element>>(`${this.uri}/elements`);
    }

    public getElementsByGrouper(grouper: boolean): Observable<SimpleList<GrouperElements>> {
        return this.http.get<SimpleList<GrouperElements>>(`${this.uri}/elements?grouper=${grouper}`);
    }

    public getUserElements(id_user?: number): Observable<SimpleList<UserElement>> {
        return this.http.get<SimpleList<UserElement>>(`${this.uri}/userelements?id_user=${id_user ? id_user : 0}`);
    }

    public getUserElementsByGrouper(id_user: number, grouper: boolean, token?: string): Observable<SimpleList<GrouperElements>> {
        return this.http.get<SimpleList<GrouperElements>>(`${this.uri}/userelements?id_user=${id_user}&grouper=${grouper}`, { headers: { Authorization: `Bearer ${token}` } });
    }   

    public storeUserElement(data: DataUserElement): Observable<DataUserElement> {
        return this.http.post<DataUserElement>(`${this.uri}/userelements`, data);
    }

    public deleteUserElement(body: OptionsForUserElement): Observable<DataUserElement> {
        return this.http.delete<DataUserElement>(`${this.uri}/userelements`, body);
    }

    public getProfileElements(id_profile?: number): Observable<SimpleList<ProfileElement>> {
        return this.http.get<SimpleList<ProfileElement>>(`${this.uri}/profilelements?id_profile=${id_profile ? id_profile : 0}`);
    }

    public getProfileElementsByGrouper(id_profile: number, grouper: boolean): Observable<SimpleList<GrouperElements>> {
        return this.http.get<SimpleList<GrouperElements>>(`${this.uri}/profilelements?id_profile=${id_profile}&grouper=${grouper}`);
    }  

}