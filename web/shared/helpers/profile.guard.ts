import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  user: User;

  constructor(private router: Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.user = JSON.parse(localStorage.getItem('user'));
      const profile: number[] = next.data['type_profile'] as number[];
      if (!this.user) return false;
      if (profile.includes(this.user.profile)){
        return true;
      }
      this.router.navigate(['/not-found']);
      return false;
  } 
}