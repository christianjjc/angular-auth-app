import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces';

export const PrivateGuard: CanActivateFn = (route, state) => {
  // console.log('isAuthenticatedGuard');
  // console.log({ route, state });

  // const url = state.url;
  // console.log({ url });
  // localStorage.setItem('url', url);

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.authStatus() === AuthStatus.authenticated) {
    return true;
  }
  router.navigateByUrl('/auth/login');
  return false;
};
