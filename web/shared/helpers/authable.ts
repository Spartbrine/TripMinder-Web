import { AuthenticationService } from 'shared/services/authentication.service';

export abstract class Authable {
  logged = false;
  constructor(private authentication: AuthenticationService) {
  }


  public logout() {
    this.authentication.logout();
    this.logged = false;
    location.href = '/login';
  }
}
