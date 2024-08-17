import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces';

// PublicGuard - PrivateGuard

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject( AuthService );
  const router = inject( Router );

  console.log({ status: authService.authStatus() });

  // Si estamos autenticados lo llevamos al dashboard
  if ( authService.authStatus() === AuthStatus.authenticated ) {
    router.navigateByUrl('/dashboard');
    return false; // Porque esta autenticado le retornamos false
  }

  //console.log('isAuthenticatedGuard');
  //console.log({ route, state });

  //return false; // Si se retorna un false se va a ver que la ruta ni siquiera se cargo.
  // Si no estamos autenticados
  return true;
};
