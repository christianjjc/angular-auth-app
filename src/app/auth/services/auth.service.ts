import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { AuthStatus, LoginResponseI, UserI } from '../interfaces';

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
      tap((res) => {
        this._currentUser.set(res.user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', res.token);
        console.log({ user: res.user, token: res.token });
      }),
      map(() => true)
    );
  }
}
