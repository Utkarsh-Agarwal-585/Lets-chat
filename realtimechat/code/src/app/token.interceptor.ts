import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { map, catchError } from 'rxjs/operators';
  import {
    Router
  } from '@angular/router';
import { Injectable } from '@angular/core';

  @Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(public router: Router){}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

        const token = localStorage.getItem('token');

        if (token) {
            console.log(token);
          request = request.clone({
            setHeaders: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              authorization: token
            }
          });
        }
        if (!request.headers.has('Content-Type')) {
          request = request.clone({
            setHeaders: {
              'content-type': 'application/json'
            }
          });
        }
        request = request.clone({
          headers: request.headers.set('Accept', 'application/json')
        });
        return next.handle(request).pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              console.log('event--->>>', event);
            }
            return event;
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              if (error.error.success === false) {
                console.log('Login failed');
              } else {
                this.router.navigate(['login']);
              }
            }
            return throwError(error);
          }));
      }
}
