import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from 'shared/services/authentication.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor, CanActivate {
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        console.log('Capturado por JWT - canActivate');
        const token = this.authenticationService.currentUserValue;
        if (token) {
            return true;
        }
        console.log('Routing...');
        this.router.navigate(['login']);
    }
    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        // console.log('Capturado por JWT - intercept');
        const token = this.authenticationService.currentUserValue;
        if (token) {
            // request.headers.set('Authorization', `Bearer ${token}`);
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request);
    }
}
