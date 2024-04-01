import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthResponse, GrouperElements, User } from 'shared/interfaces';
import { Profile } from 'shared/constants';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { randomIntId } from 'shared/utils/generator';
import { Md5 } from 'ts-md5';
import { AgentService } from 'src/app/services/agent.service';
import { BranchService } from 'src/app/services/branch.service';
@Injectable({ providedIn: 'root' })
export class AuthenticationService extends ApiService<User> {
  // private readonly apiUrl: string = 'https://localhost';
  private currentUserSubject: BehaviorSubject<string>;
  private urlElementsUser: string[] = [];
  public currentUser: Observable<string>;
  public root(): string {
    return 'auth';
  }
  constructor(public http: HttpClient, private router: Router, private agentService: AgentService, private branchService: BranchService) {
    super(http);
    this.currentUserSubject = new BehaviorSubject<string>(
      localStorage.getItem('userToken')
    );
    this.currentUser = this.currentUserSubject.asObservable();


  }

  public get currentUserValue(): string {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    // .post<AuthResponse>(`${this.apiUrl}/login/authenticate`, { username: username, pass: password })
    return this.http.post<AuthResponse>(`${this.uri}/login`, {
      email: username,
      password,
    })
      .pipe(
        map((response) => {

          const user = response.user;
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(user));
          // localStorage.setItem('userToken', response.token);

          // const hash = Md5.hashStr(user.user_name);
          localStorage.setItem('userToken', response.accessToken);
          if (response.code == 200) {
            localStorage.setItem('email', response.user.name);
            localStorage.setItem('profile', response.user.profile + '');
          }


          return response;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    localStorage.removeItem('sign');
    localStorage.removeItem('grouperElements');
    this.agentService.deleteEntityOnStorage()
    this.branchService.deleteEntityOnStorage()
    this.currentUserSubject.next(null);

  }
  /**
   * This method validates the user with Administrator and Executive
   */
  public get permissionAE(): boolean {
    const profiles: number[] = [Profile.ADMIN];
    const user: User = JSON.parse(localStorage.getItem('user_name'));
    if (!user) return false;
    return profiles.includes(user.profile) ? true : false;
  }

  public get allPermissions(): boolean {
    const profiles: number[] = [Profile.ADMIN];
    const user: User = JSON.parse(localStorage.getItem('user_name'));
    if (!user) return false;
    return profiles.includes(user.profile) ? true : false;
  }

  public get administrativeUnit(): string {
    if (!this.permissionAE) {
      const user: User = JSON.parse(localStorage.getItem('user_name'));
      return
    }
    return '';
  }

  public checkPermission(url: string) {
    const grouperElements: GrouperElements[] = JSON.parse(localStorage.getItem('grouperElements'));
    if (!grouperElements) this.logout()
    grouperElements.forEach(grouperElement => {
      grouperElement.elements.forEach(element => {
        this.urlElementsUser.push(element.url);
      })
    });
    this.urlElementsUser.includes(url) ? {} : this.router.navigate(['/home'])
  }

}
