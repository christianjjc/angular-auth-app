import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError, of } from 'rxjs';
import { environment } from '../../../environments/environments';
import {
  AuthStatus,
  CheckTokenResponseI,
  LoginResponseI,
  UserI,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;
  private httpClient = inject(HttpClient);

  private _currentUser = signal<UserI | null>(null);
  private _authStatus = signal<AuthStatus | null>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {}

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.httpClient.post<LoginResponseI>(url, body).pipe(
      tap((response) => {
        this._currentUser.set(response.user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', response.token);
        // console.log({ user: response.user, token: response.token });
      }),
      map(() => true),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');
    if (!token) return of(false);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient
      .get<CheckTokenResponseI>(url, { headers: headers })
      .pipe(
        map((response) => {
          this._currentUser.set(response.user);
          this._authStatus.set(AuthStatus.authenticated);
          localStorage.setItem('token', response.token);
          return true;
        }),
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        })
      );
  }
}
