import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { User } from 'shared/interfaces';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'shared/services/authentication.service';

export class Guardable implements CanActivate {
  logged: boolean;
  user: User;
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private profiles: number[]
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.user = JSON.parse(localStorage.getItem('user'));
    const hasPermission = (this.user) ? this.profiles.includes(this.user.perfil) : false;
    if (hasPermission) {
        return true;
    }
    this.router.navigate(['/not-found']);
    return false;
  }
}
