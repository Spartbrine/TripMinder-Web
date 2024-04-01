import { Injectable } from '@angular/core';
import { User, ListWCursor, SimpleList } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService<User> {

  constructor(http: HttpClient) {
    super(http);
  }

  public root(): string {
    return 'users';
  }

  public search(shortName: string): Observable<ListWCursor<User>> {
    return this.http.get<ListWCursor<User>>(`${this.uri}/search/${shortName}`);
  }

  public updateOnlyProfile(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.uri}/profile/${id}`, user);
  }

  public areNotAgents(): Observable<SimpleList<User>> {
    return this.http.get<SimpleList<User>>(`${this.uri}/get/arenotagents`);
  }
}