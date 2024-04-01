import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'shared/services/authentication.service';
import { Guardable } from 'shared/helpers/guardable';

@Injectable({
  providedIn: 'root'
})
export class CanActivateLoginGuard implements CanActivate {
  constructor(private $router: Router, private auth: AuthenticationService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.$router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class CanActivateUsersGuard extends Guardable implements CanActivate {
  constructor(private $router: Router, private auth: AuthenticationService) {
    super($router, auth,[
      1,
    ]);
  }
}
