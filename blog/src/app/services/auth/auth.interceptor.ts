import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth.service';
import { catchError, switchMap, throwError, filter, take, BehaviorSubject, from } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);
  const jwtHelper = new JwtHelperService();

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if (req.url.includes('/auth') || req.url.includes('/refresh') || req.url.includes('/create')) {
      return next(req);
    }

    if (token && jwtHelper.isTokenExpired(token)) {
      if (authService.isRefreshing) {
        return authService.refreshTokenSubject.pipe(
          filter(newToken => newToken !== null),
          take(1),
          switchMap(newToken => {
            console.log('Interceptor: Otrzymano nowy token z kolejki.');
            return next(req.clone({
              setHeaders: { 'x-auth-token': `Bearer ${newToken}` }
            }));
          })
        );
      }
      else {
        authService.isRefreshing = true;
        authService.refreshTokenSubject.next(null);

        return authService.refreshToken().pipe(
          switchMap((res) => {
            authService.isRefreshing = false;
            return next(req.clone({
              setHeaders: { 'x-auth-token': `Bearer ${res.token}` }
            }));
          }),
          catchError((err) => {
            console.error('Interceptor: Nie udało się odświeżyć tokena.', err);
            authService.isRefreshing = false;
            authService.logout().subscribe();
            return throwError(() => err);
          })
        );
      }
    }

    if (token) {
       req = req.clone({
        setHeaders: {
          'x-auth-token': `Bearer ${token}`
        }
      });
    }

    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
         if (error.status === 401) {
            console.warn('Interceptor: Token jest unieważniony. Wylogowywanie.');
            authService.logout().subscribe();
         }
         return throwError(() => error);
      })
    );
  }

  return next(req);
};
