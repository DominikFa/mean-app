import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { Token } from '../models/token';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3100/api';  // Ten sam port co DataService
  public isRefreshing = false;
  public refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) { }

  authenticate(credentials: any) {
    const localStorage = this.document.defaultView?.localStorage;
    return this.http.post<Token>(this.url + '/user/auth', {
      login: credentials.login,
      password: credentials.password
    }).pipe(
      map((result: Token | any) => {
        if (result && result.token) {
          localStorage?.setItem('token', result.token);
          localStorage?.setItem('refreshToken', result.refreshToken)
          return true;
        }
        return false;
      })
    );
  }

  refreshToken() {
      const localStorage = this.document.defaultView?.localStorage;
      const refreshToken = localStorage?.getItem('refreshToken');
      return this.http.post<any>(this.url + '/user/refresh', { refreshToken }).pipe(
        map(res => {
          localStorage?.setItem('token', res.token);
          localStorage?.setItem('refreshToken', res.refreshToken);
          this.refreshTokenSubject.next(res.token);
          return res;
        })
      );
  }

  createOrUpdate(credentials: any) {
    return this.http.post(this.url + '/user/create', credentials);
  }

  logout() {
    const localStorage = this.document.defaultView?.localStorage;
    const refreshToken = localStorage?.getItem('refreshToken');
    return this.http.request('delete', this.url + '/user/logout', {
      body: { refreshToken }
      }).pipe(
        map(() => {
          localStorage?.removeItem('token');
          localStorage?.removeItem('refreshToken');
        })
      );
  }

  isLoggedIn(): boolean {
    const localStorage = this.document.defaultView?.localStorage;
    const jwtHelper = new JwtHelperService();
    const token = localStorage?.getItem('token');
    if (!token) {
      return false;
    }
    return !jwtHelper.isTokenExpired(token);
  }

  get currentUser() {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    return new JwtHelperService().decodeToken(token);
  }

  getToken(): string | null {
    const localStorage = this.document.defaultView?.localStorage;
    return localStorage?.getItem('token') || null;
  }
}
