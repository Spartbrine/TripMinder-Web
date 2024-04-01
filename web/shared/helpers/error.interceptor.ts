import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthenticationService } from 'shared/services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log('Interceptado por error' + err.status +  err.error);
            if (err.status === 401 || err.status === 403) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                // TODO: En lugar de hacer un reload redirigir con el router al login
                // location.reload();
                this.router.navigate(['login']);
            }
            if (err.error) {
              const error = err.error.message || err.statusText;
              return throwError(error);
            } else {
              return throwError('Error desconocido');
            }
        }));
    }
}
